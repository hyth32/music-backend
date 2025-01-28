import MusicController from '../controllers/music.controller.js'
import BaseRouter from './base.router.js'

class MusicRouter extends BaseRouter {
    constructor() {
        super(new MusicController())
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.get('/tracks', this.bindControllerMethod('listTracks'))
    }
}

export default MusicRouter
