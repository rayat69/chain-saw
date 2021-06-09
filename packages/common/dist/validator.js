"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = exports.phone = exports.birthDate = exports.age = exports.fullName = exports.name = exports.email = void 0;
const yup_1 = require("yup");
const email = yup_1.string()
    .required('Email is required')
    .email('Invalid email format')
    .trim();
exports.email = email;
const name = yup_1.string().required().max(30).trim();
exports.name = name;
const fullName = yup_1.string().required().min(5).max(60).trim();
exports.fullName = fullName;
const age = yup_1.number().integer().positive().max(3);
exports.age = age;
const birthDate = yup_1.date();
exports.birthDate = birthDate;
const phone = yup_1.number().integer().positive().min(7);
exports.phone = phone;
const url = yup_1.string().url('Invalid url format');
exports.url = url;
//# sourceMappingURL=validator.js.map