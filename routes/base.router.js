import express from 'express'

class BaseRouter {
    constructor(controller) {
        this.router = express.Router()
        this.controller = controller
    }

    getRouter() {
        return this.router
    }

    setupRoutes() {
        throw new Error('Routes are not implemented')
    }

    bindControllerMethod(methodName) {
        if (!this.controller[methodName]) {
            throw new Error(`Method ${methodName} does not exist in the controller`)
        }
        return this.controller[methodName].bind(this.controller)
    }
}

export default BaseRouter
