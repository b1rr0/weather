export class WeatherDto {
  temperature: number;
  humidity: number;
  description: string;
}
export class WeatherWithCityDto extends WeatherDto {
  city: string;
}
