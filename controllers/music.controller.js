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
            const rawTracks = await this.spotifyService.searchTracks(q, offset, limit)

            const trackData = rawTracks.data.tracks
            const total = trackData.total
            const tracks = trackData.items

            if (!tracks.length) {
                console.log('Данные не найдены')
                ApiHelper.sendData(res, { total: 0, data: [] })
            }

            const preparedData = tracks.map(track => ({
                name: track.name,
                spotify_id: track.id,
                spotify_url: track.external_urls.spotify,
                duration: track.duration_ms,
                artist: {
                    name: track.artists[0].name,
                    spotify_id: track.artists[0].id,
                },
                album: {
                    name: track.album.name,
                    cover: track.album.images[0].url ?? null,
                    spotify_id: track.album.id,
                }
            }))
    
            ApiHelper.sendData(res, { total, data: preparedData })
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
            const rawAlbums = await this.spotifyService.listAlbumTracks(id, offset, limit)
            
            const albumData = rawAlbums.data
            const total = albumData.total
            const albums = albumData.items

            const preparedData = albums.map(item => ({
                name: item.name,
                duration: item.duration_ms,
                spotify_id: item.id,
                spotify_url: item.external_urls.spotify,
                artist: {
                    name: item.artists[0].name,
                    spotify_id: item.artists[0].name,
                },
            }))

            ApiHelper.sendData(res, { total, data: preparedData })
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
            const rawTracks = await this.spotifyService.listArtistTopTracks(id, offset, limit)
            const trackData = rawTracks.data
            const tracks = trackData.tracks

            if (!tracks.length) {
                console.log('Данные не найдены')
                ApiHelper.sendData(res, { total: 0, data: [] })
            }

            const preparedData = tracks.map(track => ({
                name: track.name,
                spotify_id: track.id,
                spotify_url: track.external_urls.spotify,
                duration: track.duration_ms,
                artist: {
                    name: track.artists[0].name,
                    spotify_id: track.artists[0].id,
                },
                album: {
                    name: track.album.name,
                    cover: track.album.images[0].url ?? null,
                    spotify_id: track.album.id,
                }
            }))

            ApiHelper.sendData(res, { total: 10, data: preparedData })
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
