import { RequestHandler } from "express";
import { compare } from "bcryptjs";
import { genHash } from "../../globalUtils/genHash";
import { db } from "../../drizzle";
import { auth } from "../../drizzle/schemas/schema";
import { eq } from "drizzle-orm";

const update: RequestHandler = async (req, res) => {
  const { currentSecret, newSecret } = req.body as { currentSecret: string; newSecret: string };
  const { uid } = res.locals;

  try {
    const userAuth = await db.query.auth.findFirst({
      where: (fields, { eq }) => eq(fields.uid, uid),
    });

    if (!userAuth) return res.status(404).end();

    const legit = await compare(currentSecret, userAuth.secret);
    if (!legit) return res.status(403).end();

    const hashedSecret = await genHash(newSecret);
    await db.update(auth).set({ secret: hashedSecret }).where(eq(auth.uid, userAuth.uid));

    return res.end();
  } catch (err) {
    return res.status(500).send("server-error");
  }
};

export default update; // 45
