import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const categoryRouter = Router();

const categoryController = new CategoryController();

categoryRouter.post('/create-category', verifyToken, verifyAdmin, categoryController.createCategory);
categoryRouter.post('/update-category/:CategoryId', verifyToken, verifyAdmin, categoryController.updateCategory);
categoryRouter.delete('/delete-category/:CategoryId', verifyToken, verifyAdmin, categoryController.deleteCategory);
categoryRouter.get('/get-single-category/:CategoryId', verifyToken, verifyUser, categoryController.getSingleCategory);
categoryRouter.get('/get-all-categories', categoryController.getAllCategories);