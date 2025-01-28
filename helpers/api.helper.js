import pkg from 'pg'
const { Client } = pkg
import ConfigHelper from './config.helper.js'

class ApiHelper {
    static createClient() {
        const config = ConfigHelper.getDBConfig()
        return new Client(config)
    }

    static sendResponse(res, code, data) {
        return res.status(code).json(data)
    }

    static sendData(res, data) {
        return this.sendResponse(res, 200, data)
    }

    static sendMessage(res, code, success, message) {
        return this.sendResponse(res, code, { success, message })
    }

    static sendSuccessMessage(res, message) {
        return this.sendMessage(res, 200, true, message)
    }

    static createError(message, status) {
        const error = new Error(message)
        error.success = false
        error.status = status
        return error
    }

    static throwErrorMessage(message = 'Не удалось обработать данные', status = 500) {
        throw this.createError(message, status)
    }

    static getParams(req) {
        return req.params
    }

    static getQuery(req) {
        return req.query
    }

    static getBody(req) {
        return req.body
    }
}

export default ApiHelper
