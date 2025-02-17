import { Router } from "express";
import limit from "../middlewares/runnerLimiter";
import login from "./login";
import refresh from "./refresh";

const authRouter = Router();

authRouter.use(limit());

authRouter.post("/login", login);
authRouter.get("/refresh", refresh);

export default authRouter;
