# Weather Microservice System

## Overview
This is a microservice-based weather application that consists of multiple services working together to provide weather information and notifications.

## Architecture
The system architecture is documented in our [diagrams.net](https://app.diagrams.net/?src=about#G1RTMtS7c_OcROmCssMEXr2HzQwzmOCGZr#%7B%22pageId%22%3A%22UOtl7gYO2UXAUBC-fHZp%22%7D) diagram.

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Running the Application
docker-compose up --build
```

### Notifier Service
The notifier service requires additional setup. Please refer to the specific README file within the notifier service directory for detailed instructions.

## Microservices
Each microservice contains its own documentation. Please refer to the README files within each service directory for specific details.

## Architecture Details
The system is designed with a microservices architecture, where each service has a specific responsibility:
- App service: Main application service
- Notifier service: Handles notifications
- Additional services as documented in the architecture diagram