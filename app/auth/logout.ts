import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import moment from "moment";
import { db } from "../../drizzle/index";
import { blacklist } from "../../drizzle/schemas/schema";

const logout: RequestHandler = async (req, res) => {
    const { headers } = req;
    const jwt = headers.authorization?.replace("Bearer ", "") || "";

    try {
        const { exp, id } = verify(jwt, process.env.JWT_SECRET_KEY!) as JwtPayload;
        const valid = moment.unix(exp || 0).isAfter();
        if (!valid) return res.end();

        await db.insert(blacklist).values({
            id,
            ttl: moment.unix(exp || 0).toDate(),
        });

        return res.end();
    } catch (error) {
        return res.status(403).end("unauthorized");
    }
};

export default logout;
