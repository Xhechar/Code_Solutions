"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solutionRouter = void 0;
const express_1 = require("express");
const solution_controller_1 = require("../controllers/solution.controller");
exports.solutionRouter = (0, express_1.Router)();
const solutionController = new solution_controller_1.SolutionController();
