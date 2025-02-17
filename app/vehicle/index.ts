import { Router } from "express";
import getVehicle from "./getVehicle";
import inspection from "./inspection";

const vehiculeRouter = Router();

vehiculeRouter.get("/:id", getVehicle);
vehiculeRouter.post("/:id", inspection);

export default vehiculeRouter;
