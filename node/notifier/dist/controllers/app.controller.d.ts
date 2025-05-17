import { MailsService } from 'src/domens/mails/mails.service';
import { MailRegistrationNotification, MailWeatherNotification } from './dto/kafka.dto';
import { WeatherService } from 'src/domens/weather/weather.service';
export declare class WeatherNotificationController {
    private readonly mailsService;
    private readonly weatherService;
    private readonly logger;
    constructor(mailsService: MailsService, weatherService: WeatherService);
    handleWeatherMessage(message: MailWeatherNotification): Promise<void>;
    handleRegistrationMessage(message: MailRegistrationNotification): Promise<void>;
}
