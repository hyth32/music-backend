import ApiHelper from '../helpers/api.helper.js'
import Track from '../models/track.model.js'
import Artist from '../models/artist.model.js'
import Album from '../models/album.model.js'
import ArtistAlbum from '../models/artistAlbum.model.js'
import ArtistTrack from '../models/artistTrack.model.js'
import AlbumTrack from '../models/albumTrack.model.js'
import SpotifyService from '../services/spotify.service.js'
import { execFile } from 'child_process'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
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

            tracks.forEach(async track => {
                const trackRecord = await Track.createNew(track.name, track.external_urls.spotify)
                const albumRecord = await Album.createNew(
                    track.album.name,
                    track.album.release_date,
                    track.album.total_tracks,
                    track.album.external_urls.spotify,
                    track.album.images ? track.album.images[0].url : null
                )

                await AlbumTrack.createNew(albumRecord[0].id, trackRecord[0].id)

                track.artists.forEach(async artist => {
                    const artistRecord = await Artist.createNew(artist.name, artist.external_urls.spotify)
                    await ArtistAlbum.createNew(artistRecord[0].id, albumRecord[0].id)
                    await ArtistTrack.createNew(artistRecord[0].id, trackRecord[0].id)
                })
            })

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

    async downloadFile(url) {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const scriptPath = path.join(__dirname, '../', 'helpers', 'download_file.sh')

        return new Promise((resolve, reject) => {
            execFile(scriptPath, [url], (error, stdout, stderr) => {
                if (error) {
                    console.log(`Error: ${error}`)
                    return ApiHelper.throwErrorMessage(`Ошибка выполнения скрипта: ${stderr}`)
                }
    
                resolve(stdout)
            })
        })
    }

    /**
     * Получение файла 
     */
    async getMusicFile(req, res, next) {
        const { url } = ApiHelper.getBody(req)

        try {
            const albumRecord = await Track.findOne({
                where: { spotify_url: url },
                include: {
                    association: Track.associations.albums,
                }
            })
            
            const artistRecord = await ArtistAlbum.findOne({
                where: { album_id: albumRecord.albums[0].id },
                include: {
                    model: Artist,
                }
            })

            const artistName = artistRecord.artist.name
            const albumName = albumRecord.albums[0].name

            const clientId = WebSocketServer.createConnectionId()
            const wsUrl = WebSocketServer.createWsUrl(clientId)
            ApiHelper.sendSuccessMessage(res, wsUrl)

            await this.downloadFile(url).then(async () => {
                const __filename = fileURLToPath(import.meta.url)
                const __dirname = path.dirname(__filename)
                const folderPath = path.join(__dirname, '../', 'assets', artistName, albumName)

                try {
                    await fs.promises.mkdir(folderPath, { recursive: true })
                    const files = await fs.promises.readdir(folderPath);
                    const musicFile = files.find(file => path.extname(file) === '.m4a')
                    const filePath = `${folderPath}/${musicFile}`

                    console.log('URL файла: ' + filePath)
                    WebSocketServer.sendMessage(clientId, { track_url: filePath })
                } catch (error) {
                    console.log(error);
                }

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
