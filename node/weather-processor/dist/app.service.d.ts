import { RecentWeatherRepository as RecentWeatherRedisRepository } from './recent.weather.repo';
import { WeatherapiService } from './weatherapi.service';
export declare class WeatherProcessorService {
    private readonly recentWeatherRedisRepository;
    private readonly weatherapiService;
    private redlock;
    private readonly LOCK_PREFIX;
    private readonly LOCK_EXPIRATION_TIME;
    constructor(recentWeatherRedisRepository: RecentWeatherRedisRepository, weatherapiService: WeatherapiService);
    getData(key: string): Promise<string>;
    private createLock;
}
