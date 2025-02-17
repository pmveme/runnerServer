import bcjs from "bcryptjs";
import { RequestHandler } from "express";
import { auth, db, eq, and } from "@pmveme/miin-db";
import { generateJWT } from "../utils/jwt";

const login: RequestHandler = async (req, res) => {
    const { phone, password } = req.body as { phone: string; password: string };

    try {
        const rows = await db
            .select()
            .from(auth)
            .where(and(eq(auth.phone, phone), eq(auth.active, true), eq(auth.app, "RUNNER")));

        if (!rows.length) return res.status(404).end("USER_NOT_FOUND");

        const [row] = rows;

        const valid = await bcjs.compare(password, row.secret);

        if (!valid) return res.status(401).end("INCORRECT_PASSWORD");

        const { uid, email } = row;
        const jwtToken = generateJWT({ email, phone, uid });

        const response = { uid, accessToken: "Bearer " + jwtToken };

        console.log(response);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).end("SERVER_ERROR");
    }
};

export default login;
