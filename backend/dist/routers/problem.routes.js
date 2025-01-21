"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.problemRouter = void 0;
const express_1 = require("express");
const problem_controller_1 = require("../controllers/problem.controller");
exports.problemRouter = (0, express_1.Router)();
const problemController = new problem_controller_1.ProblemController();
