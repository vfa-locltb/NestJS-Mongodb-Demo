"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const user_module_1 = require("./user.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(user_module_1.UserModule);
    app.use(cookieParser());
    app.enableCors({
        origin: 'https://localhost:3000',
        credentials: true,
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map