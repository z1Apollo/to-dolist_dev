import { Request, Response } from "express";
import { pool } from "../database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/authSchema";

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const { name, email, password } = parsed.data;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users 
       (name, email, password, provider) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, avatar_url`,
      [name, email, hashedPassword, "local"]
    );

    return res.status(201).json(newUser.rows[0]);

  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const { email, password } = parsed.data;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const user = result.rows[0];

    // 🚫 Impede login local se conta for OAuth
    if (user.provider !== "local") {
      return res.status(400).json({
        message: `Use login com ${user.provider} para essa conta`
      });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Conta sem senha definida" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

export const githubCallback = (req: any, res: Response) => {
  const { token, user } = req.user;

  const encodedUser = encodeURIComponent(JSON.stringify(user));

  res.redirect(
    `http://localhost:5173/oauth-success?token=${token}&user=${encodedUser}`
  );
};