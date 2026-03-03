import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
const API_URL = import.meta.env.VITE_API_URL;

export const Profile = () => {
    const { user, token, login, logout } = useAuth()
    const navigate = useNavigate()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!user) return null

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setSelectedFile(file)
        const previewUrl = URL.createObjectURL(file)
        setAvatarPreview(previewUrl)
    }

    const handleSave = async () => {
        setLoading(true)
        setError(null)

        try {
            let avatarUrl = user.avatarUrl

            if (selectedFile) {
                const formData = new FormData()
                formData.append("avatar", selectedFile)

                const uploadResponse = await fetch(
                    `${API_URL}/api/upload-avatar`,
                    {
                        method: "POST",
                        body: formData
                    }
                )

                if (!uploadResponse.ok) {
                    throw new Error("Erro no upload da imagem")
                }

                const uploadData = await uploadResponse.json()
                avatarUrl = uploadData.url
            }

            const updateResponse = await fetch(
                `${API_URL}/api/users/avatar`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ avatarUrl })
                }
            )

            if (!updateResponse.ok) {
                throw new Error("Erro ao atualizar avatar")
            }

            const updatedUser = await updateResponse.json()

            login(token!, updatedUser)
            navigate("/")

        } catch (err: any) {
            setError(err.message || "Erro ao conectar com servidor")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Meu Perfil</CardTitle>

                    <Button variant="ghost" onClick={() => navigate("/")}>
                        Voltar
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">

                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-primary/20">
                            <AvatarImage
                                src={avatarPreview || user.avatarUrl}
                                className="w-full h-full object-cover object-center"
                            />
                            <AvatarFallback className="text-lg">
                                {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div>
                        <p className="text-1xl text-muted-foreground">
                            Nome: {user.name}
                        </p>
                        <p className="text-1xl text-muted-foreground">
                            Email: {user.email}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between">
                        <Button variant="destructive" onClick={handleLogout}>
                            Sair
                        </Button>

                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}