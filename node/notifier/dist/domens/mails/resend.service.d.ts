import { MailsService } from './mails.service';
import { WeatherWithCityDto } from '../weather/dto/weather.dto';
export declare class ResendService implements MailsService {
    private readonly resend;
    constructor();
    sendWeatherMail(email: string, weather: WeatherWithCityDto): Promise<void>;
    sendRegistrationMail(email: string, token: string): Promise<void>;
    private sendMail;
}
