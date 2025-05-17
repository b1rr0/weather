"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherProcessorService = void 0;
const common_1 = require("@nestjs/common");
const recent_weather_repo_1 = require("./recent.weather.repo");
const redlock_1 = require("redlock");
const redis_config_1 = require("./config/redis.config");
const weatherapi_service_1 = require("./weatherapi.service");
let WeatherProcessorService = class WeatherProcessorService {
    recentWeatherRedisRepository;
    weatherapiService;
    redlock;
    LOCK_PREFIX = 'weather:lock:';
    LOCK_EXPIRATION_TIME = 5000;
    constructor(recentWeatherRedisRepository, weatherapiService) {
        this.recentWeatherRedisRepository = recentWeatherRedisRepository;
        this.weatherapiService = weatherapiService;
        this.redlock = new redlock_1.default([redis_config_1.redisClient], {
            driftFactor: 0.01,
            retryCount: 10,
            retryDelay: 200,
            retryJitter: 200,
        });
    }
    async getData(key) {
        const cachedData = await this.recentWeatherRedisRepository.getByCity(key);
        if (cachedData) {
            return cachedData;
        }
        const lock = await this.createLock(key);
        try {
            const doubleCheckData = await this.recentWeatherRedisRepository.getByCity(key);
            if (doubleCheckData) {
                return doubleCheckData;
            }
            const weatherData = await this.weatherapiService.calculateWeather(key);
            if (!weatherData) {
                throw new Error('Weather data not found');
            }
            await this.recentWeatherRedisRepository.setByCity(key, {
                key,
                value: weatherData,
            });
            return JSON.stringify(weatherData);
        }
        finally {
            await lock.release();
        }
    }
    async createLock(key) {
        const lockKey = `${this.LOCK_PREFIX}${key}`;
        const lock = await this.redlock.acquire([lockKey], this.LOCK_EXPIRATION_TIME);
        return lock;
    }
};
exports.WeatherProcessorService = WeatherProcessorService;
exports.WeatherProcessorService = WeatherProcessorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [recent_weather_repo_1.RecentWeatherRepository,
        weatherapi_service_1.WeatherapiService])
], WeatherProcessorService);
//# sourceMappingURL=app.service.js.map