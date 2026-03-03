import passport from "passport"
import { Strategy as GitHubStrategy } from "passport-github2"
import jwt from "jsonwebtoken"
import { pool } from "../database/db"
import axios from "axios"

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async (accessToken: string, _refreshToken: string, profile: any, done: any) => {
      try {
        let email = profile.emails?.[0]?.value

        if (!email) {
          const response = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `token ${accessToken}`
              }
            }
          )

          const primaryEmail = response.data.find(
            (e: any) => e.primary && e.verified
          )

          email = primaryEmail?.email
        }

        if (!email) {
          return done(new Error("Não foi possível obter o email do GitHub"), undefined)
        }

        let user = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        )

        if (user.rows.length === 0) {
          user = await pool.query(
            `INSERT INTO users 
             (name, email, avatar_url, provider, provider_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
              profile.displayName || profile.username,
              email,
              profile.photos?.[0]?.value,
              "github",
              profile.id
            ]
          )
        } else {
          const existingUser = user.rows[0]

          if (!existingUser.provider_id) {
            await pool.query(
              `UPDATE users 
               SET provider = $1, provider_id = $2 
               WHERE id = $3`,
              ["github", profile.id, existingUser.id]
            )
          }
        }

        const dbUser = user.rows[0]

        const token = jwt.sign(
          { id: dbUser.id },
          process.env.JWT_SECRET as string,
          { expiresIn: "7d" }
        )

        return done(null, {
          token,
          user: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            avatarUrl: dbUser.avatar_url
          }
        })
      } catch (error) {
        return done(error, undefined)
      }
    }
  )
)


export default passport
