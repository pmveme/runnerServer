import { RequestHandler } from "express";
import { db } from "../../drizzle";
import { businesses, order_status, orders } from "../../drizzle/schemas/schema";
import { and, eq, isNotNull } from "drizzle-orm";

const getCurrentRuns: RequestHandler = async (req, res) => {
    const { uid } = res.locals;

    const ORDER_CONSTRAINT = eq(orders.runner, uid);
    const BUSINESS_CONSTRAINT = eq(businesses.id, orders.business);
    const STATUS_CONSTRAINT = and(
        eq(order_status.runner, uid),
        isNotNull(order_status.cancel_code),
        isNotNull(order_status.delivered)
    );

    const ORDERS = await db
        .select()
        .from(orders)
        .where(ORDER_CONSTRAINT)
        .rightJoin(order_status, STATUS_CONSTRAINT)
        .rightJoin(businesses, BUSINESS_CONSTRAINT);

    return res.send(ORDERS);
};

export default getCurrentRuns;
