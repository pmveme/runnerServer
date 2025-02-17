import { sign } from "jsonwebtoken";
import { v4 } from "uuid";

export function generateJWT(load: { uid: string; email: string; phone: string }) {
    const { JWT_SIGN_KEY } = process.env;
    if (!JWT_SIGN_KEY) throw new Error("JWT_SIGN_KEY missing in ENV");
    return sign({ ...load, id: v4() }, JWT_SIGN_KEY, { expiresIn: "7d", issuer: "auth.miinfood.com" });
}
