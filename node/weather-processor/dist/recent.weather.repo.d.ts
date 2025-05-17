export declare class RecentWeatherRepository {
    private readonly redisClient;
    constructor();
    getByCity(city: string): Promise<string | null>;
    setByCity(city: string, data: any): Promise<"OK">;
}
