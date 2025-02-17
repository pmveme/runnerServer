import { RequestHandler } from "express";
import { generate } from "randomstring";
// import { sendSES } from "../../aws";
import { db } from "../../drizzle";
import { auth } from "../../drizzle/schemas/schema";
import { eq } from "drizzle-orm";
import { genHash } from "../../globalUtils/genHash";

const reset: RequestHandler = async (req, res) => {
    const { email, phone } = req.body as { phone: string; email: string };

    try {
        const userAuth = await db.query.auth.findFirst({
            where: (fields, { and, eq }) => and(eq(fields.phone, phone), eq(fields.email, email)),
        });

        if (!userAuth) return res.status(404).end();

        const secret = generate(14);
        const hashedSecret = await genHash(secret);

        await db
            .update(auth)
            .set({
                secret: hashedSecret,
            })
            .where(eq(auth.uid, userAuth.uid));

        // const chunks = [
        //   "Cher utilisateur,\n",
        //   "Utilisez le mot de passe ci-dessous pour pouvoir acceder a votre compte.\n",
        //   secret,
        //   "",
        //   "Si vous n'avez pas autorisé cette action veuillez nous contacter au plus tôt aux contacts ci-dessous pour sécurisé votre compte\n",
        //   "Téléphone & WhatsApp: +237 696 41 68 98",
        //   "Email: sc@miinfood.com",
        //   "Facebook & instagram: @miin",
        // ];

        // await sendSES({
        //   addresses: ["mahbab.ihsv@gmail.com"],
        //   content: chunks.join("\n"),
        //   name: "Manager d'accès miin",
        //   subject: "Votre mot de passe temporaire",
        //   sender: "no-reply",
        // });

        return res.end();
    } catch (err) {
        return res.status(500).end("server-error");
    }
};

export default reset;
