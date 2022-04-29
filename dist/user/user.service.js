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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const rxjs_1 = require("rxjs");
let UserService = class UserService {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    create(CreateUserDto) {
        const userEntity = this.userRepository.create(CreateUserDto);
        return this.mailExists(userEntity.email).pipe((0, rxjs_1.switchMap)((exists) => {
            if (!exists) {
                return this.authService.hashPassword(userEntity.password).pipe((0, rxjs_1.switchMap)((passwordHash) => {
                    userEntity.password = passwordHash;
                    return (0, rxjs_1.from)(this.userRepository.save(userEntity)).pipe((0, rxjs_1.map)((savedUser) => {
                        const { password } = savedUser, user = __rest(savedUser, ["password"]);
                        return user;
                    }));
                }));
            }
            else {
                throw new common_1.HttpException('Email already in use', common_1.HttpStatus.CONFLICT);
            }
        }));
    }
    login(loginUserDto) {
        return this.findUserByEmail(loginUserDto.email.toLowerCase()).pipe((0, rxjs_1.switchMap)((user) => {
            if (user) {
                return this.validatePassword(loginUserDto.password, user.password).pipe((0, rxjs_1.switchMap)((passwordsMatches) => {
                    if (passwordsMatches) {
                        return this.findOne(user.id).pipe((0, rxjs_1.switchMap)((user) => this.authService.generateJwt(user)));
                    }
                    else {
                        throw new common_1.HttpException('Login was not Successfulll', common_1.HttpStatus.UNAUTHORIZED);
                    }
                }));
            }
            else {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
        }));
    }
    findOne(id) {
        return (0, rxjs_1.from)(this.userRepository.findOne(id));
    }
    findAll() {
        return (0, rxjs_1.from)(this.userRepository.find());
    }
    update(id, user) {
        this.userRepository.update(id, user);
        return this.findOne(id);
    }
    updateRole(id, user) {
        this.userRepository.update(id, user);
        return this.findOne(id);
    }
    delete(id) {
        return this.userRepository.delete(id);
    }
    findUserByEmail(email) {
        return (0, rxjs_1.from)(this.userRepository.findOne({ email }, { select: ['id', 'name', 'email', 'password'] }));
    }
    validatePassword(password, storedPasswordHash) {
        return this.authService.comparePasswords(password, storedPasswordHash);
    }
    mailExists(email) {
        email = email.toLowerCase();
        return (0, rxjs_1.from)(this.userRepository.findOne({ email })).pipe((0, rxjs_1.map)((user) => {
            if (user) {
                return true;
            }
            else {
                return false;
            }
        }));
    }
    setAvatar(id, avatarUrl) {
        this.userRepository.update(id, { profileImage: avatarUrl });
        return this.findOne(id);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map