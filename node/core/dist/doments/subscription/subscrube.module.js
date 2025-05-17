"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscrubeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const subscribe_repository_1 = require("./subscribe.repository");
const hasher_module_1 = require("../../utils/hasher/hasher.module");
const subscribe_service_1 = require("./subscribe.service");
const subscription_entity_1 = require("../../entities/subscription.entity");
let SubscrubeModule = class SubscrubeModule {
};
exports.SubscrubeModule = SubscrubeModule;
exports.SubscrubeModule = SubscrubeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([subscription_entity_1.SubsribeEntity]), hasher_module_1.HasherModule],
        providers: [subscribe_service_1.SubscribeService, subscribe_repository_1.SubsribeRepository],
        exports: [subscribe_service_1.SubscribeService, subscribe_repository_1.SubsribeRepository],
    })
], SubscrubeModule);
//# sourceMappingURL=subscrube.module.js.map