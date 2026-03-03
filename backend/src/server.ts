import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes"
import { authMiddleware, AuthRequest } from "./middlewares/authMiddleware";
import uploadRoutes from "./routes/upload.routes";
import userRoutes from "./routes/user.routes"
import passport from "./config/passport";
import devTasksRoutes from "./routes/devTasks.routes";


dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.use(passport.initialize())

app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", userRoutes)
app.use("/api/dev-tasks", devTasksRoutes);

app.get("/api/profile", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    message: "Você está autenticado 🎉",
    userId: req.userId
  });
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});