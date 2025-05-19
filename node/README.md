# Weather Microservice System

## Overview
This is a microservice-based weather application that consists of multiple services working together to provide weather information and notifications.

Each microservice contains own README.md 
## Architecture
The system architecture is documented in our [diagrams.net](https://app.diagrams.net/?src=about#G1RTMtS7c_OcROmCssMEXr2HzQwzmOCGZr#%7B%22pageId%22%3A%22UOtl7gYO2UXAUBC-fHZp%22%7D) diagram.
![image](https://github.com/user-attachments/assets/e96ed090-ae65-484e-8c0e-8d56c3ecc8d0)



## Getting Started
### Prerequisites
- Docker
- Docker Compose
- Read notifier. README.md (for receiving emails) 


### Running the Application
<pre><code>bash docker-compose up --build</code></pre>
And go there http://localhost:3330/v1/swagger#/
#
Migrations are managed as part of Docker — 'migrations'
Because it's a separate job and is triggered independently (not the best practice, but a workaround to make it work on startup)
#
APP wasn’t deployed because it contains a lot of services and I didn’t have enough time. 😔  
# improvements:
1) 1 Cache instance for 2 Microservice — intended to facilitate local development.
2) Add e2e test
3) gRPC with weather-processor
4) setup SMTP server:)
5) improvements core (documented in the core README)"
5) add DLQ for kafka

