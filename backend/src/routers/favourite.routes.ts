import { Router } from "express";
import { FavouriteController } from "../controllers/favourite.controller";
import { verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const favouriteRouter = Router();

const favouriteController = new FavouriteController();

favouriteRouter.post('/add-favourite/:ProblemId', verifyToken, verifyUser, favouriteController.addFavourite);
favouriteRouter.delete('/remove-favourite/:FavouriteId', verifyToken, verifyUser, favouriteController.removeFavourite);
favouriteRouter.get('/get-user-favourites', verifyToken, verifyUser, favouriteController.getFavouritesByUser);