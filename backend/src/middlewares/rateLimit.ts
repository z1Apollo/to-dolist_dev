import rateLimit from "express-rate-limit";

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Muitas tentativas de login. Tente novamente em 15 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 3,
  message: {
    message: "Muitos cadastros detectados. Tente novamente mais tarde."
  },
  standardHeaders: true,
  legacyHeaders: false
});