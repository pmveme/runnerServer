import { RequestHandler } from "express";
import { db } from "../../drizzle";

const getNotificationStatus: RequestHandler = async (req, res) => {
    const { uid } = res.locals;
    const { device } = req.params;

    console.log("first");

    const data = await db.query.notifications.findFirst({
        where: (fields, { eq, and }) => and(eq(fields.user, uid), eq(fields.device, device)),
    });

    try {
        return res.send(data);
    } catch (error) {
        return res.status(500).end("server-error");
    }
};

export default getNotificationStatus;
