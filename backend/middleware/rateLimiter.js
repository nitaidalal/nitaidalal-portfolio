import rateLimit from "express-rate-limit";

//----login RL------
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: {
        success: false,
        message: "Too many login attempts from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


//----contact form RL------
export const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, 
    message: {
        success: false,
        message: "Too many contact form submissions from this IP, please try again after 1 hour.",
    },
    standardHeaders: true, 
    legacyHeaders: false,
})


//----register RL------
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, 
    message: {
        success: false,
        message: "Too many registration attempts from this IP, please try again after 1 hour.",
    },
    standardHeaders: true, 
    legacyHeaders: false,
})


//----General Api limiter------
export const generalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 300, 
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 10 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
})