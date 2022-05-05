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
exports.User = exports.UserRole = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["Editor"] = "editor";
    UserRole["User"] = "user";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
let User = class User {
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
};
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectID)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.User }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "profileImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "emailToLowerCase", null);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map