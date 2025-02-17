import cors from "cors";
import express from "express";
import authRouter from "./auth";
import runnerRouter from "./runners";
import vehiculeRouter from "./vehicle";
import runsRouter from "./runs";
import "../ts";
import ordersRouter from "./orders";
import orderRouter from "./order";

const app = express();
const { PORT, NODE_ENV } = process.env;

if (!PORT) throw new Error("PORT not found");
if (!NODE_ENV) throw new Error("NODE_ENV not found");

app.set("trust proxy", 1);
app.get("/ip", (request, response) => response.send(request.ip));
app.get("/health", (_, res) => res.status(200).send("SAAS SERVER STATUS: RUNNING"));

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/runners", runnerRouter);
app.use("/vehicles", vehiculeRouter);
app.use("/runs", runsRouter);
app.use("/orders", ordersRouter);
app.use("/order", orderRouter);

app.listen(PORT, () => console.log(`Server listening on ${PORT} in ${NODE_ENV}`));
