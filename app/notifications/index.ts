import { Router } from "express";
import deleteNotification from "./deleteNotification";
import getNotificationStatus from "./getNotificationStatus";
import setNotification from "./setNotification";
import runnerAudit from "../middlewares/runnerAudit";
import { getRoute } from "../utils/getRoutes";

const runnerNotificationsRouter = Router();

runnerNotificationsRouter.post(getRoute("/notifications"), runnerAudit, setNotification);
runnerNotificationsRouter.get(getRoute("/notifications/:device"), runnerAudit, getNotificationStatus);
runnerNotificationsRouter.delete(getRoute("/notifications/:device"), runnerAudit, deleteNotification);

export default runnerNotificationsRouter;
