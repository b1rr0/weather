# Weather Service Core

## Architecture

The service implements a microservices architecture with two main components:

### Weather Processor
- REST API for weather data processing
- Receives and processes weather information requests
- Future migration to gRPC is planned for better performance (not enough time)

### User Registration Service
- Tokens are stored in hashed form
- Implements the Outbox pattern for reliable user registration
- Ensures operation idempotency
- Guarantees delivery of registration events

## Outbox Pattern

For reliable user registration, we use the Outbox pattern:

1. User sends a registration request
2. Data is saved in the subscription table
3. Registration event is written to the outbox table
4. A Cronjob process handles events from the outbox table
5. After successful processing, the event is marked as processed
//TODO: Handle events stuck in infinite state

## Weather Notifications

The service includes a scheduled cronjob that handles weather notifications:
Runs every hour/day to check weather conditions.
Writes events to Kafka for reliable delivery.
// Handle case where app crashes here Promise.all.. And not all events are processed
// Altho can be done with outbox pattern, but i got out of time :(
// Create events after Hour/Day cronjob and send with outbox cronjobe 



## Configuration

All configuration settings are stored in the `.env` file:

Note: The `.env` file is intentionally included in the repository. While this is not a best practice for production environments, it's acceptable for this project as the contained credentials are not sensitive.