import { randomUUID } from 'node:crypto'

export class Database {
  #tasks = new Map()

  list(search) {
    return Array.from(this.#tasks.entries()).map(taskArray => {
      const id = taskArray[0]
      const task = taskArray[1]

      return {
        id,
        ...task
      }
    }).filter(task => {
      if(search) {
        return Object.entries(search).some(([key, value]) => {
          if(key === 'id') {
            return task[key] === value
          } else {
            return task[key]?.includes(value)
          }
        })
      }

      return true
    })
  }

  create(task) {
    const id = randomUUID()

    this.#tasks.set(id, task)
  }

  update(id, currentTask, taskInput) {
    const updatedTask = {
      id,
      title: taskInput.title,
      description: taskInput.description,
      completed_at: currentTask.completed_at,
      created_at: currentTask.created_at,
      updated_at: taskInput.updated_at,
    }

    this.#tasks.set(id, updatedTask)
  }

  updateCompletedTask(id, currentTask, taskInput) {
    const updatedTask = {
      id,
      title: currentTask.title,
      description: currentTask.description,
      completed_at: taskInput.completed_at,
      created_at: currentTask.created_at,
      updated_at: currentTask.updated_at,
    }

    this.#tasks.set(id, updatedTask)
  }

  delete(id) {
    this.#tasks.delete(id) 
  }
}