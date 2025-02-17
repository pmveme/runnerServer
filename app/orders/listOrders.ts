import {
    and,
    asc,
    businesses,
    db,
    desc,
    eq,
    isNotNull,
    isNull,
    orders,
    runners,
    order_status as status,
    zones,
} from "@pmveme/miin-db";
import { RequestHandler } from "express";

const listOrders: RequestHandler = async (req, res) => {
    const config = {
        business: {
            id: businesses.id,
            title: businesses.title,
            latitude: businesses.latitude,
            longitude: businesses.longitude,
        },
        id: status.id,
        placed: status.placed,
        accepted: status.accepted,
        picked: status.picked,
        released: status.released,
        delivered: status.delivered,
        zone: status.zone,
        distance: orders.distance,
        latitude: orders.latitude,
        longitude: orders.longitude,
    };
    try {
        const [row] = await db
            .select(config)
            .from(status)
            .where(and(isNull(status.canceled), isNotNull(status.accepted), isNull(status.picked)))
            .innerJoin(orders, eq(orders.id, status.id))
            .innerJoin(zones, eq(zones.id, orders.zone))
            .innerJoin(runners, and(eq(runners.zoneGroup, zones.group), eq(runners.id, res.locals.uid)))
            .innerJoin(businesses, eq(businesses.id, orders.business))
            .orderBy(desc(status.placed))
            .limit(1);

        return res.send(row);
    } catch (err) {
        return res.status(500).end("server-error");
    }
};

export default listOrders;
