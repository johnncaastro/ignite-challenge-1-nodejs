import fs from 'node:fs'
import { parse } from 'csv-parse'

const __dirname = new URL('./imports/list-users.csv', import.meta.url)

const stream = fs.createReadStream(__dirname)

export async function createCsvWithStream() {
  const records = []

  const parser = stream.pipe(parse({
    delimiter: ',',
    skipEmptyLines: true,
  }))

  process.stdout.write('Importing tasks...\n')

  for await (const record of parser) {
    const [ title, description ] = record

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description
      })
    })
  }

  process.stdout.write('Import completed!')
}

createCsvWithStream()