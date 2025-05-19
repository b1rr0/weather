# Notifier

A microservice for sending email notifications based on Kafka messages.

## Functionality

1. Reading messages from Kafka
2. Sending two types of emails:
   - Registration messages
   - Weather messages (with data from the weather service)
3. Sending email notifications
4. Implementing idempotency through caching

## Workflow

1. Receiving a message from Kafka
2. Checking idempotency of message
3. Depending on message type:
   - For registration: sending welcome email
   - For weather:
     - Requesting current weather data
     - Forming and sending notification
4. Saving sending information to cache

## Configuration

All settings are stored in the `.env` file:

Note: The `.env` file is included in the repository. While this is not a best practice for production environments, it's acceptable for this project as the contained credentials are not sensitive.

## SMTP Configuration

Due to some issues with direct SMTP server configuration, the service uses Mailtrap as a test SMTP server. This allows for safe testing of email functionality without the risk of sending actual emails to users. In a production environment, this should be replaced with a proper SMTP server configuration.

![Image](https://github.com/user-attachments/assets/6244e31f-6b74-4d22-949e-ed1a245224f7)
To use this service, you need to:
1. Create an account at [Mailtrap.io](https://mailtrap.io/)
2. Get your SMTP credentials from the Mailtrap dashboard
3. Update the `.env` file with your Mailtrap credentials
MAILTRAP_USER=
MAILTRAP_PASS=

Alternatively, you can check the application logs to see example email messages and their tokens, as the service logs all email notifications for testing purposes.
