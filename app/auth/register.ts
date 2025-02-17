import { RequestHandler } from "express-serve-static-core";
import { v4 } from "uuid";
import { validateRegisterData } from "../../globalUtils/yup";
import { genHash } from "../../globalUtils/genHash";
import { APP, generateJWT } from "../../globalUtils/genJWT";
import { db } from "../../drizzle";
import { auth, users } from "../../drizzle/schemas/schema";

interface Body {
  lastname: string;
  firstname: string;
  email: string;
  phone: string;
  secret: string;
}

const register: RequestHandler = async (req, res) => {
  const { email, firstname, lastname, phone, secret } = req.body as Body;
  const uid = v4();

  // TODO: validate registerData

  try {
    await validateRegisterData({ email, firstname, lastname, phone, secret });
  } catch (err: any) {
    return res.status(422).end("load-invalid");
  }

  try {
    const hashedSecret = await genHash(secret);

    await db.transaction(async (tx) => {
      await tx.insert(auth).values({
        email: email.trim().toLowerCase(),
        phone: phone.trim().toLowerCase(),
        secret: hashedSecret,
        uid,
      });
      await tx.insert(users).values({
        email: email.trim().toLowerCase(),
        firstname: firstname.trim().toLowerCase(),
        lastname: lastname.trim().toLowerCase(),
        phone,
        uid,
      });
    });

    const jwtToken = generateJWT({ email, phone, uid }, APP.CLIENT);

    return res.send({ uid, accessToken: "Bearer " + jwtToken });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).send("user-already-exist");
    return res.status(500).end();
  }
};

export default register; // 61
