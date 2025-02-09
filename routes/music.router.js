import MusicController from '../controllers/music.controller.js'
import BaseRouter from './base.router.js'

class MusicRouter extends BaseRouter {
    constructor() {
        super(new MusicController())
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.get('/tracks', this.bindControllerMethod('listTracks'))
        this.router.get('/albums/:id', this.bindControllerMethod('getAlbumTracks'))
        this.router.get('/artists/:id', this.bindControllerMethod('getArtistTracks'))
        this.router.post('/tracks/file', this.bindControllerMethod('getMusicFile'))
    }
}

export default new MusicRouter().router
