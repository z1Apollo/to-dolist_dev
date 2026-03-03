import { Response } from "express";
import { pool } from "../database/db";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { rows } = await pool.query(
      `SELECT * 
       FROM dev_tasks 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar tasks:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { title, description, priority, tech_stack } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Título é obrigatório" });
    }

    const { rows } = await pool.query(
      `INSERT INTO dev_tasks 
       (user_id, title, description, priority, tech_stack)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        req.userId,
        title,
        description || null,
        priority || "medium",
        tech_stack || null
      ]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao criar task:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { id } = req.params;
    const { title, description, status, priority, tech_stack } = req.body;

    const { rows } = await pool.query(
      `UPDATE dev_tasks
       SET title = $1,
           description = $2,
           status = $3,
           priority = $4,
           tech_stack = $5,
           updated_at = NOW()
       WHERE id = $6 
       AND user_id = $7
       RETURNING *`,
      [
        title,
        description,
        status,
        priority,
        tech_stack,
        id,
        req.userId
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Task não encontrada" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar task:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM dev_tasks 
       WHERE id = $1 
       AND user_id = $2`,
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task não encontrada" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar task:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};