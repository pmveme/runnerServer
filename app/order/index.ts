import { Router } from "express";
import runnerAudit from "../middlewares/runnerAudit";
import getOpenOrder from "./getOpenOrder";

const orderRouter = Router();

// ordersRouter.get(getRoute("/orders-open"), runnerAudit, getOpenOrders);
// ordersRouter.patch(getRoute("/orders/:order"), runnerAudit, updateOrder);
// ordersRouter.get(getRoute("/orders/:order"), runnerAudit, getOrder);
// ordersRouter.get(getRoute("/run"), runnerAudit, getCurrentRuns);

orderRouter.get("/", runnerAudit, getOpenOrder);

export default orderRouter;
