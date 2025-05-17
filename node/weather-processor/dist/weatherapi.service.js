"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherapiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let WeatherapiService = class WeatherapiService {
    API_KEY = 'd5edf1e564154fbc88b224149251405';
    BASE_URL = 'http://api.weatherapi.com/v1/current.json';
    async calculateWeather(city) {
        try {
            const response = await axios_1.default.get(`${this.BASE_URL}`, {
                params: {
                    q: city,
                    key: this.API_KEY,
                    aqi: 'no',
                },
            });
            const weatherData = {
                temperature: response.data.current.temp_c,
                humidity: response.data.current.humidity,
                description: response.data.current.condition.text,
            };
            return weatherData;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    throw new Error('Weather data not found', { cause: 404 });
                }
            }
            throw error;
        }
    }
};
exports.WeatherapiService = WeatherapiService;
exports.WeatherapiService = WeatherapiService = __decorate([
    (0, common_1.Injectable)()
], WeatherapiService);
//# sourceMappingURL=weatherapi.service.js.map