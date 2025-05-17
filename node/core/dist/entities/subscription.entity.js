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
exports.SubsribeEntity = void 0;
const subscribe_type_1 = require("../doments/subscription/dto/subscribe.type");
const typeorm_1 = require("typeorm");
let SubsribeEntity = class SubsribeEntity {
    id;
    email;
    city;
    isConfirmed;
    token;
    subscribeType;
    createdAt;
    updatedAt;
};
exports.SubsribeEntity = SubsribeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SubsribeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'email',
        nullable: false,
    }),
    __metadata("design:type", String)
], SubsribeEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'city',
        nullable: false,
    }),
    __metadata("design:type", String)
], SubsribeEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        name: 'is_confirmed',
        nullable: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], SubsribeEntity.prototype, "isConfirmed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'token',
        nullable: true,
    }),
    __metadata("design:type", String)
], SubsribeEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: subscribe_type_1.SubscribeType,
        name: 'subscribe_type',
        nullable: true,
    }),
    __metadata("design:type", String)
], SubsribeEntity.prototype, "subscribeType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        name: 'created_at',
        select: false,
    }),
    __metadata("design:type", Date)
], SubsribeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        name: 'updated_at',
        select: false,
    }),
    __metadata("design:type", Date)
], SubsribeEntity.prototype, "updatedAt", void 0);
exports.SubsribeEntity = SubsribeEntity = __decorate([
    (0, typeorm_1.Entity)('subscriptions')
], SubsribeEntity);
//# sourceMappingURL=subscription.entity.js.map