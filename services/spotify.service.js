import axios from 'axios'
import { execFile } from 'child_process'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import ApiHelper from '../helpers/api.helper.js'
import ConfigHelper from '../helpers/config.helper.js'
import accessTokenInstance from '../instances/accessToken.instance.js'
import Track from '../models/track.model.js'
import Artist from '../models/artist.model.js'
import Album from '../models/album.model.js'
import ArtistTrack from '../models/artistTrack.model.js'
import ArtistAlbum from '../models/artistAlbum.model.js'
import AlbumTrack from '../models/albumTrack.model.js'

class SpotifyService {
    constructor(accessToken = accessTokenInstance) {
        this.tokenUrl = 'https://accounts.spotify.com/api/token'
        this.apiUrl = 'https://api.spotify.com/v1/search'
        this.accessTokenInstance = accessToken
    }

    /**
     * Получение токена по Spotify API
     */
    async getToken() {
        const params = ConfigHelper.prepareSpotifyParams()

        try {
            const response = await axios.post(this.tokenUrl, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })

            const data = response.data
            this.accessTokenInstance.setToken(data.access_token, data.expires_in)
        } catch (error) {
            ApiHelper.throwErrorMessage(`Error fetching Spotify token: ${error.message}`)
        }
    }

    /**
     * Метод получения валидного токена
     */
    async getValidToken() {
        const token = this.accessTokenInstance.getToken()

        if (token) {
            return token
        }

        await this.getToken()
        return this.accessTokenInstance.getToken()
    }

    /**
     * Получение списка треков по типу поиска
     */
    async getList(type, phrase, offset = 0, limit = 10) {
        if (!['track', 'album', 'artist', 'playlist', 'show', 'episode', 'audiobook'].includes(type)) {
            ApiHelper.throwErrorMessage('Неподдерживаемый тип')
        }
    
        const accessToken = await this.getValidToken()
        
        try {
            return await axios.get(this.apiUrl, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: { q: phrase, type, offset, limit },
            })
        } catch (error) {
            ApiHelper.throwErrorMessage(`Ошибка получения списка: ${error.message}`)
        }
    }

    /**
     * Общий метод поиска
     */
    async search(type, phrase, offset, limit) {
        try {
            return await this.getList(type, phrase, offset, limit)
        } catch (error) {
            ApiHelper.throwErrorMessage(`Ошибка: ${error.message}`)
        }
    }

    /**
     * Сохранение найденных треков в бд
     */
    async saveTracksToDB(tracks) {
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
    }

    /**
     * Скачивание файла
     */
    async downloadFile(url) {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const scriptPath = path.join(__dirname, '../', 'helpers', 'download_file.sh')

        return new Promise((resolve, reject) => {
            execFile(scriptPath, [url], (error, stdout, stderr) => {
                if (error) {
                    console.log(`Error: ${error}`)
                    reject(new Error(`Ошибка скачивания: ${stderr}`))
                    return
                }
                resolve(stdout)
            })
        })
    }

    /**
     * Создание ссылки на локальный файл
     */
    async createFileUrl(url) {
        const album = await Track.getAlbum(url)
        const artistName = await ArtistAlbum.getArtistNameByAlbum(album.id)
        const albumName = album.name

        await this.downloadFile(url)

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const folderPath = path.join(__dirname, '../', 'assets', artistName, albumName)

        try {
            const files = await fs.promises.readdir(folderPath)
            const musicFile = files.find(file => path.extname(file) === '.m4a')
            const serverFolderPath = path.join('http://localhost:5000', 'assets', artistName, albumName)

            return `${serverFolderPath}/${musicFile}`
        } catch (error) {
            console.log(error)
            return ''
        }
    }
}

export default SpotifyService
