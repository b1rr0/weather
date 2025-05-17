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
exports.ResendService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let ResendService = class ResendService {
    resend;
    constructor() {
        this.resend = new resend_1.Resend('re_KMywtJJ1_PnK5y8QcZ2DG5wRJbHymFb42');
    }
    async sendWeatherMail(email, weather) {
        const subject = 'Weather Notification';
        const content = `<p>Hello ${email},</p>
    <p>The weather in ${weather.city} is ${weather.temperature}°C and ${weather.description}</p>
    <p>Thank you</p>
    `;
        await this.sendMail(email, subject, content);
    }
    async sendRegistrationMail(email, token) {
        const subject = 'Registration Notification';
        const content = `<p>Hello ${email},</p>
    <p>Your token is ${token}</p>
    <p>Please use it to login</p>
    <p>Thank you</p>
    `;
        await this.sendMail(email, subject, content);
    }
    async sendMail(email, subject, content) {
        const mailOptions = {
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: subject,
            html: content,
        };
        await this.resend.emails.send(mailOptions);
    }
};
exports.ResendService = ResendService;
exports.ResendService = ResendService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ResendService);
//# sourceMappingURL=resend.service.js.map