import { desc } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../../drizzle";
import { orders } from "../../drizzle/schemas/schema";

const runsOpen: RequestHandler = async (req, res) => {
    try {
        const data = await db.select().from(orders).orderBy(desc(orders.created_at)).limit(1);
        return res.end(data);
    } catch (err) {
        console.log(err);
        return res.status(500).end("server-error");
    }
};

export default runsOpen;
