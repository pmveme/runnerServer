import { RequestHandler } from "express";
import { db, businesses, orders, order_status as status, users, and, eq, isNull, isNotNull } from "@pmveme/miin-db";

const getOrder: RequestHandler = async (req, res) => {
    const { order } = req.params;

    console.log({ order });

    const config = {
        id: orders.id,

        status: {
            placed: status.placed,
            accepted: status.accepted,
            picked: status.picked,
            released: status.released,
            delivered: status.delivered,
            canceled: status.canceled,
        },

        user: {
            latitude: orders.latitude,
            longitude: orders.longitude,
            distance: orders.distance,
            uid: users.uid,
            lastname: users.lastname,
            firstname: users.firstname,
            phone: users.phone,
        },

        business: {
            id: businesses.id,
            title: businesses.title,
            phone: businesses.phone,
            email: businesses.email,
            latitude: businesses.latitude,
            longitude: businesses.longitude,
            areaDescription: businesses.areaDescription,
        },
    };

    try {
        const rows = await db
            .select(config)
            .from(status)
            .where(and(eq(status.runner, res.locals.uid), eq(status.id, order)))
            .innerJoin(orders, eq(orders.id, status.id))
            .innerJoin(users, eq(users.uid, orders.uid))
            .innerJoin(businesses, eq(businesses.id, orders.business));
        console.log(rows);

        return res.send(rows[0]);
    } catch (err) {
        console.log(err);
        return res.status(500).end("server-error");
    }
};

export default getOrder;
