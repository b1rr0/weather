import { WeatherWithCityDto } from './dto/weather.dto';
export declare class WeatherService {
    getWeather(city: string): Promise<WeatherWithCityDto>;
}
