import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { verifyAdmin, verifyUser } from "../middlewares/verify.tokens";

export const categoryRouter = Router();

const categoryController = new CategoryController();

categoryRouter.post('/create-catefory', verifyAdmin, categoryController.createCategory);
categoryRouter.post('/update-category/:CategoryId', verifyAdmin, categoryController.updateCategory);
categoryRouter.delete('/delete-category/:CategoryId', verifyAdmin, categoryController.deleteCategory);
categoryRouter.get('/get-single-category/:CategoryId', verifyUser, categoryController.getSingleCategory);
categoryRouter.get('/get-all-categories', categoryController.getAllCategories);