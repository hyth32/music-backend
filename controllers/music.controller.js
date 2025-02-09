import ApiHelper from '../helpers/api.helper.js'
import SpotifyService from '../services/spotify.service.js'
import WebSocketServer from './websocket.controller.js'

class MusicController {
    constructor() {
        this.spotifyService = new SpotifyService()
    }

    /**
     * Получение списка треков по поисковому запросу
     */
    async listTracks(req, res, next) {
        const { q, offset = 0, limit = 10 } = ApiHelper.getQuery(req)

        try {
            const result = await this.spotifyService.searchTracks(q, offset, limit)
            ApiHelper.sendData(res, result)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Получение списка треков альбома
     */
    async getAlbumTracks(req, res, next) {
        const { id } = ApiHelper.getParams(req)
        const { offset = 0, limit = 10 } = ApiHelper.getQuery(req)

        try {
            const result = await this.spotifyService.listAlbumTracks(id, offset, limit)
            ApiHelper.sendData(res, result)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Получение списка треков исполнителя
     */
    async getArtistTracks(req, res, next) {
        const { id } = ApiHelper.getParams(req)
        const { offset = 0, limit = 10 } = ApiHelper.getQuery(req)

        try {
            const result = await this.spotifyService.listArtistTopTracks(id, offset, limit)
            ApiHelper.sendData(res, result)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Получение ссылки на файл по Spotify URL 
     */
    async getMusicFile(req, res, next) {
        const { url } = ApiHelper.getBody(req)

        try {
            const clientId = WebSocketServer.createConnectionId()
            const wsUrl = WebSocketServer.createWsUrl(clientId)
            ApiHelper.sendSuccessMessage(res, wsUrl)

            const filePath = await this.spotifyService.createFileUrl(url)
            WebSocketServer.sendMessage(clientId, { track_url: filePath })
        } catch (error) {
            next(error)
        }
    }
}

export default MusicController
