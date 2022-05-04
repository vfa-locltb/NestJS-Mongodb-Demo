"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = exports.typeOrmAsyncConfig = void 0;
const config_1 = require("@nestjs/config");
exports.typeOrmAsyncConfig = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async () => {
        return {
            type: 'mongodb',
            url: 'mongodb+srv://chuongnvt:chuongnvt@cluster0.uosty.mongodb.net/nestjs-mongodb-demo?retryWrites=true&w=majority',
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            extra: {
                charset: 'utf8mb4_unicode_ci',
            },
            synchronize: true,
            logging: true,
        };
    },
};
exports.typeOrmConfig = {
    type: 'mongodb',
    url: 'mongodb+srv://chuongnvt:chuongnvt@cluster0.uosty.mongodb.net/nestjs-mongodb-demo?retryWrites=true&w=majority',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    synchronize: true,
    logging: true,
};
//# sourceMappingURL=typeorm.config.js.map