import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { blacklist, db, eq } from "@pmveme/miin-db";

const runnerAudit: RequestHandler = async (req, res, next) => {
    const JWT = req.headers.authorization?.replace("Bearer ", "");

    try {
        if (!JWT) throw new Error("JWT not found");

        const { JWT_SIGN_KEY } = process.env;
        if (!JWT_SIGN_KEY) throw new Error("JWT_SIGN_KEY missing in ENV");

        const { uid, id } = verify(JWT, JWT_SIGN_KEY) as JwtPayload;

        const blacklisted = await db.select().from(blacklist).where(eq(blacklist.id, id));
        if (blacklisted.length) throw new Error("JWT_BLACKLISTED");

        res.locals.uid = uid;

        return next();
    } catch (error) {
        console.log(error);
        return res.status(403).end("BUSINESS_AUDIT_UNAUTHORIZED");
    }
};

export default runnerAudit;
