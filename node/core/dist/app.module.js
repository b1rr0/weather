"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_config_1 = require("./configs/typeorm.config");
const hasher_service_1 = require("./utils/hasher/hasher.service");
const subscription_controller_1 = require("./controllers/subscription.controller");
const hasher_module_1 = require("./utils/hasher/hasher.module");
const subscrube_module_1 = require("./doments/subscription/subscrube.module");
const weather_module_1 = require("./doments/weather/weather.module");
const schedule_1 = require("@nestjs/schedule");
const event_module_1 = require("./doments/event/event.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.dbConfig),
            hasher_module_1.HasherModule,
            subscrube_module_1.SubscrubeModule,
            weather_module_1.WeatherModule,
            schedule_1.ScheduleModule.forRoot(),
            event_module_1.EventModule,
        ],
        controllers: [subscription_controller_1.SubscriptionController],
        providers: [hasher_service_1.HasherService, subscrube_module_1.SubscrubeModule, weather_module_1.WeatherModule, event_module_1.EventModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map