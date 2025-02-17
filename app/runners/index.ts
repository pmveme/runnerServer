import { Router } from "express";
import getRunner from "./getRunner";

const runnerRouter = Router();

runnerRouter.get("/:runner", getRunner);

export default runnerRouter;
