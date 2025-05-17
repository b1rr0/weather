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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscription_dto_1 = require("../doments/subscription/dto/subscription.dto");
const subscribe_service_1 = require("../doments/subscription/subscribe.service");
const weather_service_1 = require("../doments/weather/weather.service");
let SubscriptionController = class SubscriptionController {
    subscribeService;
    weatherService;
    constructor(subscribeService, weatherService) {
        this.subscribeService = subscribeService;
        this.weatherService = weatherService;
    }
    async getWeather(city) {
        return this.weatherService.getWeather(city);
    }
    async subscribe(createSubscriptionDto) {
        console.log('New subscription:', createSubscriptionDto);
        await this.subscribeService.createSubscription(createSubscriptionDto);
    }
    async confirmSubscription(token) {
        await this.subscribeService.confirmSubscription(token);
    }
    async unsubscribe(token) {
        await this.subscribeService.unsubscribe(token);
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Get)('weather'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current weather for a city' }),
    (0, swagger_1.ApiParam)({
        name: 'city',
        description: 'City name',
        required: true,
        type: String,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Weather data' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid city name' }),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getWeather", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Subscribe to weather updates' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscription successful. Confirmation email sent.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already subscribed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Get)('confirm/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm email subscription' }),
    (0, swagger_1.ApiParam)({
        name: 'token',
        description: 'Confirmation token',
        required: true,
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscription confirmed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Token not found' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "confirmSubscription", null);
__decorate([
    (0, common_1.Get)('unsubscribe/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Unsubscribe from weather updates' }),
    (0, swagger_1.ApiParam)({
        name: 'token',
        description: 'Unsubscribe token',
        required: true,
        type: String,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unsubscribed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid token' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Token not found' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "unsubscribe", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('subscription'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [subscribe_service_1.SubscribeService,
        weather_service_1.WeatherService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map