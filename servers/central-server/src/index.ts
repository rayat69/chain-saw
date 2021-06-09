import { CorsOptions } from 'cors'
;(async () => {
  // Module Import
  ;(await import('dotenv')).config()
  const { default: express, json, text } = await import('express')
  const { createServer } = await import('http')
  const { default: cors } = await import('cors')
  // const { nanoid } = await import('nanoid')
  // const {socketIo} = await import('./utils/socket')

  const { shortUrlRef } = await import('./utils/firebase')

  //   Constants
  const corsValue: CorsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: ['http://localhost:3000', 'http://localhost:5000'],
  }

  //    Initializing Servers
  const app = express()
  const server = createServer(app)
  // const io = socketIo(server, corsValue)

  //   Applying Middlewares
  app.use(json(), text())
  app.use(cors(corsValue))

  app.get('/short/:id', async (req, res) => {
    const { id } = req.params

    try {
      const shortUrl = shortUrlRef.child(id)
      const urlSnapshot = await shortUrl.get()
      const { fullUrl, clicks } = urlSnapshot.val()

      shortUrl.update({
        clicks: clicks + 1,
      })

      res.redirect(fullUrl)
    } catch (error) {
      res.status(404).send(error.message)
    }
  })

  server.listen(4000, () => {
    console.log('>_ http://localhost:%d', 4000)
  })
})()
