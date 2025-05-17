export declare class WeatherapiService {
    private readonly API_KEY;
    private readonly BASE_URL;
    calculateWeather(city: string): Promise<{
        temperature: any;
        humidity: any;
        description: any;
    }>;
}
