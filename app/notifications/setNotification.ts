import { RequestHandler } from "express";
import { db } from "../../drizzle";
import { notifications } from "../../drizzle/schemas/schema";

const setNotification: RequestHandler = async (req, res) => {
    const { uid } = res.locals;
    const { token, device, app } = req.body as { token: string; device: string; app: "CLIENT" | "RUNNER" | "BUSINESS" };

    try {
        await db.insert(notifications).values({ user: uid, data: token, device, app });
        return res.end();
    } catch (error) {
        console.log("setNotification.ts", error);
        return res.status(500).end("SERVER_ERROR");
    }
};

export default setNotification;
