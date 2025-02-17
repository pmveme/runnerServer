import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../../drizzle";
import { notifications } from "../../drizzle/schemas/schema";

const deleteNotification: RequestHandler = async (req, res) => {
    const { uid } = res.locals;
    const { device } = req.params;

    try {
        await db.delete(notifications).where(and(eq(notifications.user, uid), eq(notifications.device, device)));
        console.log("token deleted");
        return res.end();
    } catch (error) {
        console.log("deleteNotification.ts", error);
        return res.status(500).end("server-error");
    }
};

export default deleteNotification;
