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
var SubscribeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeService = void 0;
const common_1 = require("@nestjs/common");
const hasher_service_1 = require("../../utils/hasher/hasher.service");
const subscribe_repository_1 = require("./subscribe.repository");
const token_generator_1 = require("../../utils/generators/token.generator");
let SubscribeService = SubscribeService_1 = class SubscribeService {
    hasherService;
    subscriptionRepository;
    logger = new common_1.Logger(SubscribeService_1.name);
    constructor(hasherService, subscriptionRepository) {
        this.hasherService = hasherService;
        this.subscriptionRepository = subscriptionRepository;
    }
    async createSubscription(createSubscriptionDto) {
        const subscription = this.subscriptionRepository.create(createSubscriptionDto);
        subscription.token = await this.hasherService.hashData((0, token_generator_1.generateToken)());
        const savedSubscription = await this.subscriptionRepository.manager.transaction(async (transactionalEntityManager) => {
            const saved = await transactionalEntityManager.save(subscription);
            return saved;
        });
        return savedSubscription;
    }
    async confirmSubscription(token) {
        const hashedToken = await this.hasherService.hashData(token);
        const subscription = await this.subscriptionRepository.findByToken(hashedToken);
        if (!subscription) {
            throw new common_1.NotFoundException('Token not found');
        }
        subscription.isConfirmed = true;
        await this.subscriptionRepository.save(subscription);
    }
    async unsubscribe(token) {
        const hashedToken = await this.hasherService.hashData(token);
        const subscription = await this.subscriptionRepository.findByToken(hashedToken);
        if (!subscription) {
            throw new common_1.NotFoundException('Token not found');
        }
        await this.subscriptionRepository.remove(subscription);
    }
};
exports.SubscribeService = SubscribeService;
exports.SubscribeService = SubscribeService = SubscribeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hasher_service_1.HasherService,
        subscribe_repository_1.SubsribeRepository])
], SubscribeService);
//# sourceMappingURL=subscribe.service.js.map