import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const userRouter = Router();

const userController = new UserController();

userRouter.post('/create-user', userController.createUser);
userRouter.put('/update-user', verifyToken, verifyUser, userController.updateUser);
userRouter.put('/update-profile-image', verifyToken, verifyUser, userController.updateProfileImage);
userRouter.put('/soft-delete-user/:UserId', verifyToken, verifyAdmin, userController.softDeleteUser);
userRouter.delete('/delete-user/:UserId', verifyToken, verifyAdmin, userController.deleteUser);
userRouter.put('/restore-user/:UserId', verifyToken, verifyAdmin, userController.restoreUser);
userRouter.put('/update-user-role/:UserId', verifyToken, verifyAdmin, userController.restoreUser);
userRouter.get('/get-single-user', verifyToken, verifyUser, userController.getSingleUser);
userRouter.get('/get-all-users', verifyToken, verifyAdmin, userController.getAllUsers);
userRouter.get('/get-soft-deleted-users', verifyToken, verifyAdmin, userController.getSoftDeletedUsers);
userRouter.put('/bulk-delete-users', verifyToken, verifyAdmin, userController.bulkDeleteUsers);