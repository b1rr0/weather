import { CreateSubscriptionDto } from '../doments/subscription/dto/subscription.dto';
import { SubscribeService } from 'src/doments/subscription/subscribe.service';
import { WeatherService } from 'src/doments/weather/weather.service';
import { WeatherDto } from 'src/doments/weather/dto/weather.dto';
export declare class SubscriptionController {
    private readonly subscribeService;
    private readonly weatherService;
    constructor(subscribeService: SubscribeService, weatherService: WeatherService);
    getWeather(city: string): Promise<WeatherDto>;
    subscribe(createSubscriptionDto: CreateSubscriptionDto): Promise<void>;
    confirmSubscription(token: string): Promise<void>;
    unsubscribe(token: string): Promise<void>;
}
