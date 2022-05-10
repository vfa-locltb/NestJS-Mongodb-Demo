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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./entities/user.entity");
const rxjs_1 = require("rxjs");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const jwt_guards_1 = require("../auth/guards/jwt.guards");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const multer_1 = require("multer");
const readFileAsync = (0, util_1.promisify)(fs_1.readFile);
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const sharp = require("sharp");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const roles_guards_1 = require("../auth/guards/roles.guards");
const swagger_1 = require("@nestjs/swagger");
const mailer_1 = require("@nestjs-modules/mailer");
const maxSize = 10 * 1024 * 1024;
const bcrypt = require('bcrypt');
let UserController = class UserController {
    constructor(userService, mailerService) {
        this.userService = userService;
        this.mailerService = mailerService;
        this.SERVER_URL = "http://localhost:3000/";
        this.sizes = ['50X50', '100X100', '200X200'];
    }
    create(createUserDto) {
        return (0, rxjs_1.from)(this.userService.create(createUserDto));
    }
    findOne(id) {
        return (0, rxjs_1.from)(this.userService.findOne(id));
    }
    login(loginUserDto) {
        return this.userService.login(loginUserDto).pipe((0, rxjs_1.map)((jwt) => {
            return {
                access_token: jwt,
                token_type: 'jwt',
                expires_in: 10000
            };
        }));
    }
    findAll(page = 1, limit = 10, username, request) {
        limit = limit > 100 ? 100 : limit;
        return this.userService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/user' });
    }
    update(id, userData) {
        return this.userService.update(id, userData);
    }
    updateRole(id, user) {
        return (0, rxjs_1.from)(this.userService.updateRole(id, user));
    }
    async delete(id) {
        return await this.userService.delete(id);
    }
    async uploadFile(id, file) {
        const [, ext] = file.mimetype.split('/');
        this.saveImage(ext, file);
        return this.userService.setAvatar(id, `${this.SERVER_URL}${file.path}`);
    }
    saveImage(ext, file) {
        if (['jpeg', 'png', 'png'].includes(ext)) {
            this.sizes.forEach((s) => {
                const [size] = s.split('X');
                readFileAsync(file.path).then((b) => {
                    return sharp(b).resize(+size).toFile(`./uploads/profileimages/${s}/${file.filename}`);
                }).then(console.log).catch(console.error);
            });
        }
    }
    async forgot(email) {
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await this.userService.findOnes({ email });
        await this.userService.updateToken(user.id, { token });
        await this.mailerService.sendMail({
            to: email,
            subject: 'Reset Your Password !',
            html: `<h2><strong>Code: <strong/><b style="color: blue">${token}<b/></h2> `,
        });
        return {
            massage: 'Please check your email !'
        };
    }
    async reset(token, password, password_confirm) {
        if (password !== password_confirm) {
            throw new common_1.BadRequestException('password do not match');
        }
        const passwordReset = await this.userService.findOnes({ token });
        if (!passwordReset) {
            throw new common_1.NotFoundException('Verify code not successful !');
        }
        const user = await this.userService.findOnes({ email: passwordReset.email });
        if (!user) {
            throw new common_1.NotFoundException('User not found !');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.userService.updatePassword(user.id, { password: hashedPassword });
        return {
            massage: 'Reset Password Successful !'
        };
    }
    async changePassword(email, old_password, new_password, confirm_password) {
        const user = await this.userService.findOnes({ email });
        if (!user) {
            throw new common_1.NotFoundException('User not found !');
        }
        await this.userService.checkPassword(old_password, user.password);
        if (new_password !== confirm_password) {
            throw new common_1.NotFoundException('Password do not match');
        }
        const hashedPassword = await bcrypt.hash(new_password, 12);
        await this.userService.updatePassword(user.id, { password: hashedPassword });
        return {
            massage: 'Change password successful !'
        };
    }
};
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "login", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.Admin),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('username')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)('edit/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.hasRoles)(user_entity_1.UserRole.Admin),
    (0, common_1.UseGuards)(jwt_guards_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, common_1.Put)('edit/:id/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/profileimages',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        }),
        limits: { fileSize: maxSize }
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadFile", null);
__decorate([
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "saveImage", null);
__decorate([
    (0, common_1.Post)('forgotPassword'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgot", null);
__decorate([
    (0, common_1.Post)('resetPassword'),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Body)('password_confirm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "reset", null);
__decorate([
    (0, common_1.Post)('changePassword'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('old_password')),
    __param(2, (0, common_1.Body)('new_password')),
    __param(3, (0, common_1.Body)('confirm_password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
UserController = __decorate([
    (0, common_1.Controller)('api'),
    (0, swagger_1.ApiTags)('todos'),
    __metadata("design:paramtypes", [user_service_1.UserService, mailer_1.MailerService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map