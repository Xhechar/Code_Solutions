"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteController = void 0;
const favourite_service_1 = require("../services/favourite.service");
const verify_tokens_1 = require("../middlewares/verify.tokens");
const favouriteService = new favourite_service_1.FavouriteService();
class FavouriteController {
    async addFavourite(req, res) {
        try {
            res.status(201).json(await favouriteService.addFavourite((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async removeFavourite(req, res) {
        try {
            res.status(201).json(await favouriteService.removeFavourite(req.params.FavouriteId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getFavouritesByUser(req, res) {
        try {
            res.status(201).json(await favouriteService.getFavouritesByUser((0, verify_tokens_1.getIdFromToken)(req)));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.FavouriteController = FavouriteController;
