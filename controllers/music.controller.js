import ApiHelper from '../helpers/api.helper.js'
import SpotifyService from '../services/spotify.service.js'

class MusicController {
    constructor() {
        this.spotifyService = new SpotifyService()
    }
    
    /**
     * Получение списка треков по поисковому запросу
     */
    async listTracks(req, res, next) {
        const { q, offset = 0, limit = 10 } = req.query

        try {
            const rawTracks = await this.spotifyService.search('track', q, offset, limit)

            const trackData = rawTracks.data.tracks
            const total = trackData.total
            const tracks = trackData.items

            if (!tracks.length) {
                console.log('Данные не найдены')
                return []
            }
    
            ApiHelper.sendData(res, {
                total,
                data: tracks.map(track => track.toJSON()),
            })
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
