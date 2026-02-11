pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        ECR_REGISTRY = '123456789012.dkr.ecr.us-east-1.amazonaws.com' // Placeholder, this should be dynamic or set in env
        BACKEND_REPO = 'devops-assignment-backend'
        FRONTEND_REPO = 'devops-assignment-frontend'
        CLUSTER_NAME = 'devops-assignment-cluster'
        BACKEND_SERVICE = 'devops-assignment-backend-service'
        FRONTEND_SERVICE = 'devops-assignment-frontend-service'
        GIT_SHA = "${env.GIT_COMMIT}"
    }

    stages {
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'pip install -r requirements.txt'
                            sh 'pip install pytest'
                            sh 'pytest'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm test -- --watchAll=false'
                        }
                    }
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            docker.build("${ECR_REGISTRY}/${BACKEND_REPO}:${GIT_SHA}", "-f backend/Dockerfile backend")
                            docker.build("${ECR_REGISTRY}/${BACKEND_REPO}:latest", "-f backend/Dockerfile backend")
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            docker.build("${ECR_REGISTRY}/${FRONTEND_REPO}:${GIT_SHA}", "-f frontend/Dockerfile frontend")
                            docker.build("${ECR_REGISTRY}/${FRONTEND_REPO}:latest", "-f frontend/Dockerfile frontend")
                        }
                    }
                }
            }
        }

        stage('Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'aws-ecr-credentials', passwordVariable: 'AWS_PASSWORD', usernameVariable: 'AWS_USERNAME')]) {
                        sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                        
                        sh "docker push ${ECR_REGISTRY}/${BACKEND_REPO}:${GIT_SHA}"
                        sh "docker push ${ECR_REGISTRY}/${BACKEND_REPO}:latest"
                        
                        sh "docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:${GIT_SHA}"
                        sh "docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:latest"
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withEnv(["BACKEND_IMAGE=${ECR_REGISTRY}/${BACKEND_REPO}:${GIT_SHA}", "FRONTEND_IMAGE=${ECR_REGISTRY}/${FRONTEND_REPO}:${GIT_SHA}"]) {
                        // Force new deployment to pick up the latest image (since we are updating 'latest' tag, or specific sha)
                        // Best practice: Update task definition with specific SHA, but for simplicity here we force deployment
                        sh "aws ecs update-service --cluster ${CLUSTER_NAME} --service ${BACKEND_SERVICE} --force-new-deployment"
                        sh "aws ecs update-service --cluster ${CLUSTER_NAME} --service ${FRONTEND_SERVICE} --force-new-deployment"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}