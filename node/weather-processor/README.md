# Weather-Processor

1. Client requests weather data for a specific city
2. System checks local cache for existing data
3. If data exists and is not expired, returns cached data
4. If data is missing or expired:
   - Fetches fresh data from external weather API
   - Updates cache with new data
   - Returns fresh data to client

## Configuration

All configuration settings are stored in the `.env` file:

Note: The `.env` file is intentionally included in the repository. While this is not a best practice for production environments, it's acceptable for this project as the contained credentials are not sensitive.