import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FaGithub } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Field, FieldGroup } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth();
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
                                Entre com a sua conta
                            </CardTitle>
                            <CardDescription>
                                Utilize seu email e senha ou GitHub para entrar.
                            </CardDescription>
                            <CardAction>
                                <Button className="text-muted-foreground hover:text-primary hover:cursor-pointer" onClick={() => {navigate("/cadastro")}} variant={"link"}>Cadastro</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <form className="flex flex-col gap-2"
                            onSubmit={async (e) => {
                                e.preventDefault()
                                setError(null)
                                setLoading(true)

                                try {
                                    const response = await fetch(`${API_URL}/api/auth/login`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({ email, password })
                                    })

                                    const data = await response.json()

                                    if (!response.ok) {
                                        setError(data.message || "Email ou senha inválidos")
                                        return
                                    }

                                    login(data.token, data.user)
                                    navigate("/")

                                } catch {
                                    setError("Erro ao conectar com servidor")
                                } finally {
                                    setLoading(false)
                                }
                            }}
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label> 
                                    <Input type="email" id="email" placeholder="example@email.com"  className={error ? "border-red-500 focus-visible:ring-red-500" : ""} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="grid">
                                    <div className="flex items-center"> 
                                        <Label htmlFor="password">Senha</Label>
                                        
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={"link"} className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:underline hover:cursor-pointer hover:text-primary">Esqueceu a senha?</Button>   
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Enviaremos um código de segurança para o seu email.</DialogTitle>
                                                    <DialogDescription>Verifique se o email que você está usando é o cadastrado no nosso projeto.</DialogDescription>
                                                </DialogHeader>
                                                <FieldGroup>
                                                    <Field className="flex">
                                                        <Input type="email" id="email-cod" placeholder="confirme seu email." required/>
                                                    </Field>
                                                    <Field>
                                                        <div className="flex justify-center items-center gap-10">
                                                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                                                                <InputOTPGroup>
                                                                    <InputOTPSlot index={0} />
                                                                    <InputOTPSlot index={1} />
                                                                    <InputOTPSlot index={2} />
                                                                    <InputOTPSlot index={3} />
                                                                    <InputOTPSlot index={4} />
                                                                    <InputOTPSlot index={5} />
                                                                </InputOTPGroup>
                                                            </InputOTP>
                                                            <Button>Enviar código</Button>
                                                        </div>
                                                    </Field>
                                                </FieldGroup>
                                                <DialogFooter>
                                                    <Button className="w-full mt-2">Confirmar</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <Input type="password" id="password" placeholder="sua senha secreta"  className={error ? "border-red-500 focus-visible:ring-red-500" : ""} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md">
                                        {error}
                                    </div>
                                )}
                            <Button className="mt-6 w-full hover:cursor-pointer" type="submit" disabled={loading}>
                                {loading ? "Entrando..." : "Entrar"}
                            </Button>
                            </form>  
                            <div className="flex items-center gap-4 mt-4">
                                <Separator />
                                    <span className="text-xs text-muted-foreground">ou</span>
                                <Separator />
                            </div>
                            <Button type="button" variant={"outline"} className="mt-4 w-full hover:cursor-pointer" onClick={() => {window.location.href = `${API_URL}/api/auth/github`}}> <FaGithub className="mr-2" /> Entrar com o GitHub</Button>
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