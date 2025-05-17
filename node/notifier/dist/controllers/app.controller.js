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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WeatherNotificationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherNotificationController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const kafka_dto_1 = require("./dto/kafka.dto");
const weather_service_1 = require("../domens/weather/weather.service");
let WeatherNotificationController = WeatherNotificationController_1 = class WeatherNotificationController {
    mailsService;
    weatherService;
    logger = new common_1.Logger(WeatherNotificationController_1.name);
    constructor(mailsService, weatherService) {
        this.mailsService = mailsService;
        this.weatherService = weatherService;
    }
    async handleWeatherMessage(message) {
        if (!message) {
            this.logger.warn('Received empty message');
            return;
        }
        const weather = await this.weatherService.getWeather(message.city);
        await this.mailsService.sendWeatherMail(message.email, weather);
    }
    async handleRegistrationMessage(message) {
        if (!message) {
            this.logger.warn('Received empty message');
            return;
        }
        await this.mailsService.sendRegistrationMail(message.email, message.token);
    }
};
exports.WeatherNotificationController = WeatherNotificationController;
__decorate([
    (0, microservices_1.MessagePattern)('mail-weather-notification'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kafka_dto_1.MailWeatherNotification]),
    __metadata("design:returntype", Promise)
], WeatherNotificationController.prototype, "handleWeatherMessage", null);
__decorate([
    (0, microservices_1.MessagePattern)('mail-registration-notification'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kafka_dto_1.MailRegistrationNotification]),
    __metadata("design:returntype", Promise)
], WeatherNotificationController.prototype, "handleRegistrationMessage", null);
exports.WeatherNotificationController = WeatherNotificationController = WeatherNotificationController_1 = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)('MailsService')),
    __metadata("design:paramtypes", [Object, weather_service_1.WeatherService])
], WeatherNotificationController);
//# sourceMappingURL=app.controller.js.map