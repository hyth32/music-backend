import express from 'express'
import { connectDB } from './db.js'
import router from './routes/router.js'
import path from 'path'
import ConfigHelper from './helpers/config.helper.js'
import errorMiddleware from './middlewares/error.middleware.js'
import apiMiddleware from './middlewares/api.middleware.js'
import WebSocketServer from './controllers/websocket.controller.js'
import { associateModels } from './models/associate.js'
import { fileURLToPath } from 'url'
import http from 'http'

const app = express()
const server = http.createServer(app)

const PORT = ConfigHelper.getAppPort()

app.use(apiMiddleware)
app.use(errorMiddleware)

app.use(express.json())

app.use('/api', router)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const assetsPath = path.join(__dirname, 'assets')
app.use('/assets', express.static(assetsPath))

const startServer = async () => {
    try {
        await connectDB()
        associateModels()

        WebSocketServer.initialize(server)
    } catch (error) {
        console.error('Ошибка синхронизации моделей:', error)
    }

    server.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`)
    })
}

startServer()
