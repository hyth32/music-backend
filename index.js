import express from 'express'
import { connectDB } from './db.js'
import router from './routes/router.js'
import path from 'path'
import ConfigHelper from './helpers/config.helper.js'
import errorMiddleware from './middlewares/error.middleware.js'
import apiMiddleware from './middlewares/api.middleware.js'
import { associateModels } from './models/associate.js'
import { fileURLToPath } from 'url'

const app = express()
const PORT = ConfigHelper.getAppPort()

app.use(apiMiddleware)
app.use(errorMiddleware)

app.use(express.json())

app.use('/api', router)

const __filename = fileURLToPath(import.meta.url)
const __dirmane = path.dirname(__filename)
const tablesPath = path.join(__dirmane, 'tables')
app.use('/tables', express.static(tablesPath))

const startServer = async () => {
    try {
        await connectDB()
        associateModels()
    } catch (error) {
        console.error('Ошибка синхронизации моделей:', error)
    }

    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`)
    })
}

startServer()
