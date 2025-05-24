import { createServer } from 'node:http'
import { routes } from './routes.js'
import { json } from './middlewares/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.url.test(url) && route.method === method
  })

  if(route) {
    const routeParams = url.match(route.url)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)