"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyRouter = void 0;
const express_1 = require("express");
const history_controller_1 = require("../controllers/history.controller");
exports.historyRouter = (0, express_1.Router)();
const historyController = new history_controller_1.HistoryController();
