import { Router } from "express";
import { userController } from "./user.controller";

const userRouter = Router();

userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.registerUser);
export const userRoutes = userRouter;
