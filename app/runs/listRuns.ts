import { and, db, eq, runs } from "@pmveme/miin-db";
import { RequestHandler } from "express";

const listRuns: RequestHandler = async (req, res) => {
    const USER_CONSTRAINT = eq(runs.runner, res.locals.uid);
    try {
        const rows = await db.select().from(runs).where(and(USER_CONSTRAINT));
        return res.send(rows);
    } catch (error) {
        return res.status(500).end("SERVER_ERROR");
    }
};

export default listRuns;
