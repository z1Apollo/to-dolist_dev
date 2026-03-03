import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { FaGithub } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
const API_URL = import.meta.env.VITE_API_URL;

export const SingUp = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    return (
        <> 
            <div className="h-screen flex justify-center w-full">
                <section className="flex items-center justify-center bg-background h-full max-w-3xl w-full p-4">
                    <Card className="w-full max-w-md ">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold tracking-tighter">
                                Cadastre-se
                            </CardTitle>
                            <CardDescription>
                                Utilize um email válido para o seu cadastro.
                            </CardDescription>
                            <CardAction>
                                <Button className="text-muted-foreground hover:text-primary hover:cursor-pointer" onClick={() => {navigate("/login")}} variant={"link"}>Entrar</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <form className="flex flex-col gap-4"
                            onSubmit={async (e) => {
                                e.preventDefault()
                                setError(null)
                                setLoading(true)

                                try {
                                    const response = await fetch(`${API_URL}/api/auth/register`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({ name, email, password })
                                    })

                                    const data = await response.json()

                                    if (!response.ok) {
                                        setError(data.message || "Erro no cadastro")
                                        return
                                    }

                                    navigate("/login")
                                } catch {
                                    setError("Erro ao conectar com servidor")
                                } finally {
                                    setLoading(false)
                                }
                            }}
                            >
                                 <div className="grid gap-2">
                                    <Label htmlFor="nome">Nome</Label>
                                    <Input type="text" id="nome" placeholder="digite seu nome"  className={error ? "border-destructive focus-visible:ring-destructive" : ""} value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" id="email" placeholder="example@email.com"  className={error ? "border-destructive focus-visible:ring-destructive" : ""} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input type="password" id="password" placeholder="crie um senha forte"  className={error ? "border-destructive focus-visible:ring-destructive" : ""} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                {error && (
                                    <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md">
                                        {error}
                                    </div>
                                )}
                            <Button className="mt-6 w-full hover:cursor-pointer" disabled={loading}>
                                {loading ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                            </form>  
                            <div className="flex items-center gap-4 mt-4">
                                <Separator />
                                    <span className="text-xs text-muted-foreground text-center">ou</span>
                                <Separator />
                            </div>
                            <Button variant={"outline"} className="mt-4 w-full hover:cursor-pointer" onClick={() => {window.location.href = `${API_URL}/api/auth/github`}}> <FaGithub className="mr-2" /> Entrar com o GitHub</Button>
                        </CardContent>
                        <CardFooter>
                            <p className="text-muted-foreground text-center text-sm">Ao entrar em nossa plataforma, você concorda com nossos Termos de Uso e Política de Privacidade.</p>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </>
    )
}