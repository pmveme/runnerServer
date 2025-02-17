import { Router } from "express";
import runnerAudit from "../middlewares/runnerAudit";
import listOrders from "./listOrders";
import updateOrder from "./updateOrder";
import getOrder from "./getOrder";

const ordersRouter = Router();

// ordersRouter.get(getRoute("/orders-open"),  getOpenOrders);
// ordersRouter.patch(getRoute("/orders/:order"), runnerAudit, updateOrder);
// ordersRouter.get(getRoute("/orders/:order"), runnerAudit, getOrder);
// ordersRouter.get(getRoute("/run"), runnerAudit, getCurrentRuns);
ordersRouter.use(runnerAudit);

ordersRouter.get("/", listOrders);
ordersRouter.get("/:order", getOrder);
ordersRouter.patch("/:order", updateOrder);

export default ordersRouter;
