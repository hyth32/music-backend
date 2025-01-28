import { Sequelize } from '@sequelize/core'
import ConfigHelper from './helpers/config.helper.js'

const dbConfig = ConfigHelper.getDBConfig()

export const sequelize = new Sequelize({
    ...dbConfig,
    logging: false,
})

export const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('Подключение к базе данных успешно установлено.')

        await sequelize.sync({ alter: true })
        console.log('Модели синхронизированы.')
    } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error)
        process.exit(1)
    }
}
