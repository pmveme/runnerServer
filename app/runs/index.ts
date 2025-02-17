import { Router } from "express";
import runnerAudit from "../middlewares/runnerAudit";
import listRuns from "./listRuns";

const runsRouter = Router();

runsRouter.get("/", runnerAudit, listRuns);

export default runsRouter;
