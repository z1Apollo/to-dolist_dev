import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export const Layout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="font-semibold text-lg">To-do list Dev</h1>

        <ul className="flex place-items-center justify-center gap-5">
            <li>
                {user && (
                    <Button
                    variant="ghost"
                    onClick={() => navigate("/profile")}
                    className="p-0 h-auto hover:bg-transparent cursor-pointer"
                    >
                    <Avatar className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                        <AvatarImage
                        src={user.avatarUrl || ""}
                        className="w-full h-full object-cover object-center"
                        />
                        <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    </Button>
                )}
            </li>
        </ul>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} To-do list Dev. Todos os direitos reservados.
      </footer>

    </div>
  )
}