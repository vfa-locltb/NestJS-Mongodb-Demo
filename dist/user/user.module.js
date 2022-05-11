"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const auth_module_1 = require("../auth/auth.module");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const validate_user_middleware_1 = require("../middleware/validate.user.middleware");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let UserModule = class UserModule {
    configure(consumer) {
        consumer.apply(validate_user_middleware_1.ValidateUserMiddleware).exclude({
            path: 'api/user',
            method: common_1.RequestMethod.GET,
        }).forRoutes(user_controller_1.UserController);
    }
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            config_1.ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.M_HOST,
                    port: parseInt(process.env.M_PORT, 10),
                    auth: {
                        user: process.env.M_USER,
                        pass: process.env.M_PASS
                    }
                },
                preview: true,
                defaults: {
                    from: '"No Reply" <noreply@example.com>',
                },
            }),
            auth_module_1.AuthModule,
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map