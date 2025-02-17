import { RequestHandler } from "express";
import { db, eq, vehicles } from "@pmveme/miin-db";

const getVehicle: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const rows = await db.select().from(vehicles).where(eq(vehicles.id, id));
        const [row] = rows;

        if (!row) return res.status(404).end();
        if (!row.running) return res.status(405).end("VEHICULE_UNAVAILABLE");
        return res.send(row);
    } catch (error) {
        return res.status(500).end("server-error");
    }
};

export default getVehicle;
