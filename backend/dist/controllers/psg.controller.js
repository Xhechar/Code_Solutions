"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PSGController = void 0;
const psg_service_1 = require("../services/psg.service");
const psgService = new psg_service_1.PSGService();
class PSGController {
    async createPSG(req, res) {
        try {
            res.status(201).json(await psgService.createPSG(req.params.ProjectId, req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updatePSG(req, res) {
        try {
            res.status(201).json(await psgService.updatePSG(req.params.PSGId, req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deletePSG(req, res) {
        try {
            res.status(201).json(await psgService.deletePSG(req.params.PSGId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getPSGsByProject(req, res) {
        try {
            res.status(201).json(await psgService.getPSGsByProject(req.params.ProjectId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.PSGController = PSGController;
