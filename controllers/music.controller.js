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
            const rawTracks = await this.spotifyService.search('track', q, offset, limit)

            const trackData = rawTracks.data.tracks
            const total = trackData.total
            const tracks = trackData.items

            if (!tracks.length) {
                console.log('Данные не найдены')
                return { total: 0, data: [] }
            }

            await this.spotifyService.saveTracksToDB(tracks)

            const preparedData = tracks.map(track => ({
                artist: track.artists[0].name,
                duration: track.duration_ms,
                name: track.name,
                url: track.external_urls.spotify,
            }))
    
            ApiHelper.sendData(res, { total, data: preparedData })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Получение файла 
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

    /**
     * Получение списка треков альбома
     */
    async getAlbum() {}

    /**
     * Получение списка треков исполнителя
     */
    async getArtist() {}
}

export default MusicController
