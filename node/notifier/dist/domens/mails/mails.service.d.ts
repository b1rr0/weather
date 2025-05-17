import { WeatherWithCityDto } from '../weather/dto/weather.dto';
export interface MailsService {
    sendWeatherMail(email: string, weather: WeatherWithCityDto): Promise<void>;
    sendRegistrationMail(email: string, token: string): Promise<void>;
}
