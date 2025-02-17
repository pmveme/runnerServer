import { RequestHandler } from "express";
import {
    asc,
    eq,
    and,
    isNull,
    isNotNull,
    db,
    order_status as status,
    orders,
    users,
    businesses,
    inArray,
} from "@pmveme/miin-db";

const getOpenOrder: RequestHandler = async (req, res) => {
    console.log(">>>> getOpenOrder", req.query);
    // return res.end();
    const CONSTRAINT = and(
        isNotNull(status.accepted),
        isNull(status.canceled),
        isNull(status.picked),
        isNull(orders.runner),
        inArray(status.zone, (req.query.zones as string[]).map(Number))
    );
    const ORDER_JOIN = eq(orders.id, status.id);
    const BUSINESS_JOIN = eq(businesses.id, orders.business);

    try {
        const rows = await db
            .select({
                id: status.id,
                placed: status.placed,
                business: {
                    id: businesses.id,
                    title: businesses.title,
                    latitude: businesses.latitude,
                    longitude: businesses.longitude,
                },
            })
            .from(status)
            .innerJoin(orders, ORDER_JOIN)
            .innerJoin(businesses, BUSINESS_JOIN)
            .where(CONSTRAINT)
            .orderBy(asc(status.placed))
            .limit(1);
        return res.send(rows[0]);
    } catch (err) {
        return res.status(500).end("server-error");
    }
};

export default getOpenOrder;
