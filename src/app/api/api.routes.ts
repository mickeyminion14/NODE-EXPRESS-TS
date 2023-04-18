import { Router } from "express";
import { userRoutes } from "./user/user.routes";
import "./api.swagger";

const router: Router = Router();

router.use("/users", userRoutes);

export const apiRouter = router;
