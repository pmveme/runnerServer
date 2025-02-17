import rateLimit from "express-rate-limit";

export default function limit(limit = 5) {
    return rateLimit({
        limit,
        windowMs: 60 * 1000,
        legacyHeaders: false,
        standardHeaders: "draft-7",
        validate: {
            xForwardedForHeader: true,
        },
    });
}
