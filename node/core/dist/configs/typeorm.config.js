"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const path = require("path");
const typeorm_1 = require("typeorm");
const dbConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [path.join(__dirname, '../entities/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '../migrations/*.ts')],
    synchronize: true,
};
exports.dbConfig = dbConfig;
exports.default = new typeorm_1.DataSource(dbConfig);
console.log(dbConfig);
//# sourceMappingURL=typeorm.config.js.map