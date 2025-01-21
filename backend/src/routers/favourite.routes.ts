import { Router } from "express";
import { FavouriteController } from "../controllers/favourite.controller";
import { verifyUser } from "../middlewares/verify.tokens";

export const favouriteRouter = Router();

const favouriteController = new FavouriteController();

favouriteRouter.post('/add-favourite', verifyUser, favouriteController.addFavourite);
favouriteRouter.delete('/remove-favourite/:FavouriteId', verifyUser, favouriteController.removeFavourite);
favouriteRouter.get('/get-user-favourites', verifyUser, favouriteController.getFavouritesByUser);