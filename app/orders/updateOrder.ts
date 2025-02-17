import { RequestHandler } from "express";
import { eq, sql, db, businesses, order_status, orders, runs, aliasedTable } from "@pmveme/miin-db";
import { haversineDistanceKM } from "../utils/haversine";

enum ACTION {
    ACCEPT = "ACCEPT",
    START = "START",
    END = "END",
}

interface Load {
    action: ACTION;
    longitude: string;
    latitude: string;
}

const DISTANCE_THRESHOLD = process.env.NODE_ENV === "production" ? 0.035 : 25;

const updateOrder: RequestHandler = async (req, res) => {
    console.log("===================================================");
    const { order } = req.params;
    const { action, latitude, longitude } = req.body as Load;

    switch (action) {
        case ACTION.ACCEPT:
            try {
                await db.transaction(async tx => {
                    const rows = await tx
                        .select({
                            order: orders,
                            status: order_status,
                        })
                        .from(orders)
                        .where(eq(orders.id, order))
                        .innerJoin(order_status, eq(order_status.id, order));

                    const [target] = rows;

                    console.log(target);

                    if (!target) throw new Error("404");
                    if (target.order.runner === res.locals.uid) throw new Error("405");

                    const status = target.status;

                    const pass = [status?.accepted, !status?.canceled, !status?.picked, !status?.delivered].every(
                        Boolean
                    );

                    if (!pass) throw new Error("405");

                    await tx.update(orders).set({ runner: res.locals.uid }).where(eq(orders.id, order));
                    await tx.update(order_status).set({ runner: res.locals.uid }).where(eq(order_status.id, order));
                    await tx.insert(runs).values({
                        accept_latitude: latitude,
                        accept_longitude: longitude,
                        order,
                        runner: res.locals.uid,
                    });
                });

                return res.end();
            } catch (err: any) {
                console.log(err);
                const errCode = parseInt(err.message);
                if (isNaN(errCode)) return res.status(500).end();

                return res.status(errCode).end();
            }

        case ACTION.START:
            try {
                await db.transaction(async tx => {
                    // const target = await tx.query.orders.findFirst({
                    //     where: fields => eq(fields.id, order),
                    //     with: { status: true, business: true },
                    // });

                    const [target] = await tx
                        .select({
                            uid: orders.uid,
                            id: orders.id,
                            runner: orders.runner,
                            user_latitude: orders.latitude,
                            user_longitude: orders.longitude,
                            status: order_status,
                            business: businesses,
                        })
                        .from(orders)
                        .where(eq(orders.id, order))
                        .innerJoin(order_status, eq(order_status.id, order))
                        .innerJoin(businesses, eq(businesses.id, orders.business));

                    if (!target) throw new Error("404:ORDER_NOT_FOUND");
                    if (target.runner !== res.locals.uid) throw new Error("403:UNAUTHORIZED");

                    const distance = haversineDistanceKM(
                        +latitude,
                        +longitude,
                        +target.business.latitude,
                        +target.business.longitude
                    );

                    console.log({ distance });

                    if (distance > DISTANCE_THRESHOLD) throw new Error("425:TOO_FAR");

                    const status = target.status;

                    const pass = [
                        status?.accepted,
                        !status?.canceled,
                        status?.released,
                        !status?.picked,
                        !status?.delivered,
                    ].every(Boolean);

                    if (!pass) throw new Error("405:ORDER_NOT_RELEASED");

                    await tx
                        .update(runs)
                        .set({
                            start_latitude: latitude,
                            start_longitude: longitude,
                            start_timestamp: sql`NOW()`,
                            order,
                            runner: res.locals.uid,
                        })
                        .where(eq(runs.order, order));

                    await tx
                        .update(order_status)
                        .set({ picked: sql`NOW()` })
                        .where(eq(order_status.id, order));
                });

                return res.end();
            } catch (err: any) {
                const [CODE, MSG] = (err.message as string).split(":");
                console.log({ CODE, MSG });
                return res.status(+CODE).end(MSG);
                const errCode = parseInt(err.message);
                if (isNaN(errCode)) return res.status(500).end();

                return res.status(errCode).end();
            }

        case ACTION.END:
            try {
                await db.transaction(async tx => {
                    const [target] = await tx
                        .select({
                            uid: orders.uid,
                            id: orders.id,
                            runner: orders.runner,
                            user_latitude: orders.latitude,
                            user_longitude: orders.longitude,
                            status: order_status,
                        })
                        .from(orders)
                        .where(eq(orders.id, order))
                        .innerJoin(order_status, eq(order_status.id, order));

                    if (!target) throw new Error("404:ORDER_NOT_FOUND");
                    if (target.runner !== res.locals.uid) throw new Error("403:UNAUTHORIZED");

                    const distance = haversineDistanceKM(
                        +latitude,
                        +longitude,
                        +target.user_latitude,
                        +target.user_longitude
                    );

                    console.log({ distance });

                    if (distance > DISTANCE_THRESHOLD) throw new Error("425:TOO_FAR");

                    const status = await db.query.order_status.findFirst({ where: fields => eq(fields.id, order) });

                    const pass = [
                        status?.accepted,
                        !status?.canceled,
                        status?.released,
                        status?.picked,
                        !status?.delivered,
                    ].every(Boolean);

                    console.log([
                        status?.accepted,
                        status?.canceled,
                        status?.released,
                        status?.picked,
                        status?.delivered,
                    ]);

                    if (!pass) throw new Error("405:ORDER_NOT_PICKED");

                    await tx
                        .update(runs)
                        .set({
                            end_latitude: latitude,
                            end_longitude: longitude,
                            end_timestamp: sql`NOW()`,
                        })
                        .where(eq(runs.order, order));

                    await tx
                        .update(order_status)
                        .set({ delivered: sql`NOW()` })
                        .where(eq(order_status.id, order));
                });

                return res.end();
            } catch (err: any) {
                const [CODE, MSG] = (err.message as string).split(":");
                return res.status(+CODE).end(MSG);
            }

        default:
            return res.status(500).end("SERVER_ERROR");
    }
};

export default updateOrder;
