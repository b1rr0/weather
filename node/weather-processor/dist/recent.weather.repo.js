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
exports.RecentWeatherRepository = void 0;
const common_1 = require("@nestjs/common");
const redis_config_1 = require("./config/redis.config");
let RecentWeatherRepository = class RecentWeatherRepository {
    redisClient;
    constructor() {
        this.redisClient = redis_config_1.redisClient;
    }
    async getByCity(city) {
        return this.redisClient.get(city);
    }
    async setByCity(city, data) {
        return this.redisClient.set(city, JSON.stringify(data), 'EX', redis_config_1.CACHE_ENTRY_EXPIRATION_TIME);
    }
};
exports.RecentWeatherRepository = RecentWeatherRepository;
exports.RecentWeatherRepository = RecentWeatherRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RecentWeatherRepository);
//# sourceMappingURL=recent.weather.repo.js.map