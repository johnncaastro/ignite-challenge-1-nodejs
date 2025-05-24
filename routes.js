import { createCsvWithStream } from "./utils/create-csv-with-stream.js"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    url: buildRoutePath("/tasks"),
    method: "GET",
    handler: (req, res) => {
      const { search } = req.query
      const title = search
      const description = search

      const tasks = database.list(search ? { title, description } : '')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    url: buildRoutePath("/tasks"),
    method: "POST",
    handler: (req, res) => {
      try {
        const task = {
          title: req.body.title,
          description: req.body.description,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: null,
        }

        database.create(task)

        return res.writeHead(201).end()
      } catch {
        return res.writeHead(400)
        .end(JSON.stringify({ error: 'O título e descrição são obrigatórios!' }))
      }
    }
  },
  {
    url: buildRoutePath("/tasks/:id"),
    method: "PUT",
    handler: (req, res) => {
      const { id } = req.params

      try {
        const currentTask = database.list({ id })

        if(currentTask.length === 0) {
          return res.writeHead(404).end(JSON
            .stringify({ error: 'O registro não existe!' }))
        }

        database.update(id, currentTask[0], {
          title: req.body.title ?? currentTask[0].title,
          description: req.body.description ?? currentTask[0].description,
          updated_at: new Date().toISOString(),
        })

        return res.writeHead(204).end()
      } catch {
        return res.writeHead(400)
        .end(JSON.stringify({ error: 'O título e descrição são obrigatórios!' }))
      }
    }
  },
  {
    url: buildRoutePath("/tasks/:id/complete"),
    method: "PATCH",
    handler: (req, res) => {
      const { id } = req.params

      try {
        const currentTask = database.list({ id })

        if(currentTask.length === 0) {
          return res.writeHead(404).end(JSON
            .stringify({ error: 'O registro não existe!' }))
        }

        database.updateCompletedTask(id, currentTask[0], {
          completed_at: currentTask[0].completed_at ? null : new Date().toISOString(),
        })

        return res.writeHead(204).end()
      } catch {
        return res.writeHead(400)
        .end(JSON.stringify({
          error: 'Ocorreu um erro durante a atualização do registro'
        }))
      }
    }
  },
  {
    url: buildRoutePath("/tasks/:id"),
    method: "DELETE",
    handler: (req, res) => {
      const { id } = req.params

      const currentTask = database.list({ id })

      if(currentTask.length === 0) {
        return res.writeHead(404).end(JSON
          .stringify({ error: 'O registro não existe!' }))
      }

      database.delete(id)

      return res.writeHead(204).end()
    }
  }
]