import { RequestHandler } from "express";
import { db, eq, inspections, runners, vehicles } from "@pmveme/miin-db";

type InspectStatus = 0 | 1 | 2;

const inspection: RequestHandler = async (req, res) => {
    const { vehicle, autostart, blinkers, box, headlight, helmet, horn, taillight, vest } = req.body as {
        vehicle: string;
        headlight: InspectStatus;
        taillight: InspectStatus;
        blinkers: InspectStatus;
        horn: InspectStatus;
        autostart: InspectStatus;
        box: InspectStatus;
        helmet: InspectStatus;
        vest: InspectStatus;
    };

    try {
        await db.transaction(async tx => {
            const [row] = await tx.select().from(vehicles).where(eq(vehicles.id, vehicle));

            if (!row) return tx.rollback();

            await tx.insert(inspections).values({
                user: res.locals.uid,
                vehicle: row.id,
                autostart,
                blinkers,
                box,
                headlight,
                helmet,
                horn,
                taillight,
                vest,
            });

            await tx.update(runners).set({ vehicle });
        });

        return res.send();
    } catch (error) {
        return res.status(500).end("server-error");
    }
};

export default inspection;
