import { Router } from "express";
import { register, login, githubCallback } from "../controllers/authController";
import { loginRateLimit, registerRateLimit } from "../middlewares/rateLimit";
import passport from "passport";

const router = Router();

router.post("/register", registerRateLimit, register);
router.post("/login", loginRateLimit, login);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
)

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  githubCallback
)

export default router;