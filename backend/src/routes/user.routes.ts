import { Router } from "express"
import { pool } from "../database/db"
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware"

const router = Router()

router.put(
  "/users/avatar",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { avatarUrl } = req.body

      if (!avatarUrl) {
        return res.status(400).json({ message: "Avatar é obrigatório" })
      }

      const result = await pool.query(
        "UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING id, name, email, avatar_url",
        [avatarUrl, req.userId]
      )

      const user = result.rows[0]

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url
      })

    } catch {
      return res.status(500).json({ message: "Erro ao atualizar avatar" })
    }
  }
)

export default router