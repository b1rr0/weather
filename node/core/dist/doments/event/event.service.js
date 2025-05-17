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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const event_constants_1 = require("./contants/event.constants");
const event_repository_ts_1 = require("./event.repository.ts");
const kafka_service_1 = require("../../utils/kafka/kafka.service");
const schedule_1 = require("@nestjs/schedule");
let EventService = class EventService {
    eventRepository;
    kafkaService;
    constructor(eventRepository, kafkaService) {
        this.eventRepository = eventRepository;
        this.kafkaService = kafkaService;
    }
    async createSubscribeEvent(transactionalEntityManager, data) {
        const event = this.eventRepository.create({
            data: JSON.stringify(data),
            type: event_constants_1.EventType.SUBSCRIPTION,
            status: event_constants_1.ProcessStatus.PENDING,
        });
        return this.eventRepository.saveEvent(transactionalEntityManager, event);
    }
    async sendEvent() {
        console.log('sendEvent');
        const events = await this.eventRepository.findBy({
            status: event_constants_1.ProcessStatus.PENDING,
        });
        if (events.length === 0) {
            return;
        }
        await this.eventRepository.update(events.map((event) => event.id), {
            status: event_constants_1.ProcessStatus.PROCESSING,
        });
        await Promise.all(events.map((event) => this.processEvent(event)));
    }
    async processEvent(event) {
        try {
            const data = JSON.parse(event.data);
            await this.kafkaService.write('subscription', event.id.toString(), data);
            await this.eventRepository.update(event.id, {
                status: event_constants_1.ProcessStatus.COMPLETED,
            });
        }
        catch (error) {
            console.error(error);
            await this.eventRepository.update(event.id, {
                status: event_constants_1.ProcessStatus.PENDING,
            });
        }
    }
};
exports.EventService = EventService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventService.prototype, "sendEvent", null);
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_repository_ts_1.EventRepository,
        kafka_service_1.KafkaService])
], EventService);
//# sourceMappingURL=event.service.js.map