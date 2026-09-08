"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityUsersModule = void 0;
const common_1 = require("@nestjs/common");
const university_users_service_1 = require("./university-users.service");
const university_users_controller_1 = require("./university-users.controller");
let UniversityUsersModule = class UniversityUsersModule {
};
exports.UniversityUsersModule = UniversityUsersModule;
exports.UniversityUsersModule = UniversityUsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [university_users_controller_1.UniversityUsersController],
        providers: [university_users_service_1.UniversityUsersService],
        exports: [university_users_service_1.UniversityUsersService],
    })
], UniversityUsersModule);
//# sourceMappingURL=university-users.module.js.map