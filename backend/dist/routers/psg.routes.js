"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.psgRouter = void 0;
const express_1 = require("express");
const psg_controller_1 = require("../controllers/psg.controller");
exports.psgRouter = (0, express_1.Router)();
const psgController = new psg_controller_1.PSGController();
