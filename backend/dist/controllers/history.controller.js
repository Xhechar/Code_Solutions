"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryController = void 0;
const verify_tokens_1 = require("../middlewares/verify.tokens");
const history_service_1 = require("../services/history.service");
const historyService = new history_service_1.HistoryService();
class HistoryController {
    async addHistory(req, res) {
        try {
            res.status(201).json(await historyService.addHistory((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getHistoryByUser(req, res) {
        try {
            res.status(201).json(await historyService.getHistoryByUser((0, verify_tokens_1.getIdFromToken)(req)));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async clearHistory(req, res) {
        try {
            res.status(201).json(await historyService.clearHistory((0, verify_tokens_1.getIdFromToken)(req)));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deleteSingleHistory(req, res) {
        try {
            res.status(201).json(await historyService.deleteSingleHistory((0, verify_tokens_1.getIdFromToken)(req), req.params.HistoryId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.HistoryController = HistoryController;
