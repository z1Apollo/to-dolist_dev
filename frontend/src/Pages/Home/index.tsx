import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const API_URL = import.meta.env.VITE_API_URL

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "doing" | "done"
  priority: "low" | "medium" | "high"
  tech_stack: string[]
}

export const Home = () => {
  const { token } = useAuth()

  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [techStack, setTechStack] = useState("")

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/api/dev-tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const createTask = async () => {
    if (!title) return

    await fetch(`${API_URL}/api/dev-tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        tech_stack: techStack.split(",").map(t => t.trim())
      })
    })

    setTitle("")
    setDescription("")
    setTechStack("")
    fetchTasks()
  }

  const updateStatus = async (task: Task, status: string) => {
    await fetch(`${API_URL}/api/dev-tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...task, status })
    })

    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await fetch(`${API_URL}/api/dev-tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })

    fetchTasks()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Nova Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <Input
            placeholder="Título da task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select onValueChange={setPriority} defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Tecnologia usada (React, Node, Python)"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
          />

          <Button onClick={createTask} className="w-full">
            Criar Task
          </Button>

        </CardContent>
      </Card>

      <div className="grid gap-4">

        {tasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4 space-y-3">

              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{task.title}</h3>

                <Badge variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                    ? "secondary"
                    : "outline"
                }>
                  {task.priority}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>

              <div className="flex gap-2 flex-wrap">
                {task.tech_stack?.map((tech, i) => (
                  <Badge key={i} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3">

                <Select
                  defaultValue={task.status}
                  onValueChange={(value: string) => updateStatus(task, value)}
                >
                  <SelectTrigger className="w-37">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Pendente</SelectItem>
                    <SelectItem value="doing">Em andamento</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>

              </div>

            </CardContent>
          </Card>
        ))}

      </div>

    </div>
  )
}
