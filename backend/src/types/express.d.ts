declare global {
  namespace Express {
    interface User {
      token: string
      user: {
        id: number
        name: string
        email: string
        avatar_url?: string | null
      }
    }
  }
}

export {}