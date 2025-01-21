"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.psRouter = void 0;
const express_1 = require("express");
const project_structure_controller_1 = require("../controllers/project.structure.controller");
exports.psRouter = (0, express_1.Router)();
const psController = new project_structure_controller_1.ProjectStructureController();
