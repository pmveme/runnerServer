import { db, auth, blacklist, and, eq } from "@pmveme/miin-db";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import moment from "moment";
import { generateJWT } from "../utils/jwt";

const refresh: RequestHandler = async (req, res) => {
    console.log("refresh called");
    const { headers } = req;
    const { JWT_SIGN_KEY } = process.env;

    const JWT = headers.authorization?.replace("Bearer ", "") || "";

    if (!JWT_SIGN_KEY) throw new Error("JWT_SIGN_KEY_NOT_FOUND");

    try {
        const { exp, uid, id } = verify(JWT, JWT_SIGN_KEY) as JwtPayload;

        if (!exp) return res.status(403).end();

        const expiresIn = moment.unix(exp).diff(moment(), "minutes");

        console.log({ expiresIn });

        if (expiresIn < 0) return res.status(403).end();
        if (expiresIn > 5) return res.send({ uid, accessToken: "Bearer " + JWT });

        await db.insert(blacklist).values({ id, ttl: moment.unix(exp).toDate() });

        const [user] = await db
            .select()
            .from(auth)
            .where(and(eq(auth.uid, uid), auth.active));

        if (!user) return res.status(404).end("USER_NOT_FOUND");

        const { phone, email } = user;
        const jwtToken = generateJWT({ uid, email, phone });

        return res.end({ uid, accessToken: "Bearer " + jwtToken });
    } catch (error) {
        return res.status(403).end("unauthorized");
    }
};

export default refresh;
