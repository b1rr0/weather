import { WeatherProcessorService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: WeatherProcessorService);
    getWeather(city: string): Promise<string>;
}
