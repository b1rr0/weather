"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_ENTRY_EXPIRATION_TIME = exports.redisClient = void 0;
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
config_1.ConfigModule.forRoot();
const { REDIS_HOST, REDIS_PORT } = process.env;
exports.redisClient = new ioredis_1.Redis({
    host: REDIS_HOST ?? 'localhost',
    port: 6379,
});
exports.CACHE_ENTRY_EXPIRATION_TIME = 900;
//# sourceMappingURL=redis.config.js.map