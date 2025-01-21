"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stackRouter = void 0;
const express_1 = require("express");
const stack_controller_1 = require("../controllers/stack.controller");
exports.stackRouter = (0, express_1.Router)();
const stackController = new stack_controller_1.StackController();
