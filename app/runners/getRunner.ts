import { db, eq, runners, zones, order_status as status } from "@pmveme/miin-db";
import { RequestHandler } from "express";

const getRunner: RequestHandler = async (req, res) => {
    const { runner } = req.params;
    const ZONES_JOIN = eq(zones.group, runners.zoneGroup);
    const STATUS_JOIN = eq(status.runner, runner);

    try {
        const rows = await db
            .select()
            .from(runners)
            .innerJoin(zones, ZONES_JOIN)
            .leftJoin(status, STATUS_JOIN)
            .where(eq(runners.id, runner));
        const zoneList = rows.map(row => row.zones.id);
        const deliveries = rows.map(row => row?.order_status?.id as string).filter(Boolean);

        console.log(rows);
        const [row] = rows;

        if (!row) return res.status(404).end();
        const resp = { ...row.runners, zones: zoneList, deliveries };

        return res.send(resp);
    } catch (error) {
        console.log(error);

        return res.status(500).end("SERVER_ERROR");
    }
};

export default getRunner;
