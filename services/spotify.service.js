import axios from 'axios'
import { execFile } from 'child_process'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import ApiHelper from '../helpers/api.helper.js'
import ConfigHelper from '../helpers/config.helper.js'
import accessTokenInstance from '../instances/accessToken.instance.js'
import Track from '../models/track.model.js'
import ArtistAlbum from '../models/artistAlbum.model.js'

class SpotifyService {
    constructor(accessToken = accessTokenInstance) {
        this.tokenUrl = 'https://accounts.spotify.com/api/token'
        this.searchApiUrl = 'https://api.spotify.com/v1/search'
        this.albumsApiUrl = 'https://api.spotify.com/v1/albums'
        this.artistsTopApiUrl = 'https://api.spotify.com/v1/artists'
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
     * Получение списка треков по поисковому запросу
     */
    async searchTracks(q, offset, limit) {
        try {
            const searchTypes = ['track'].join(',')
            const accessToken = await this.getValidToken()
            const response = await axios.get(this.searchApiUrl, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { type: searchTypes, q, limit, offset },
            })

            const trackData = response.data.tracks
            const total = trackData.total
            const tracks = trackData.items

            if (!tracks.length) {
                console.log('Данные не найдены')
                return { total: 0, data: [] }
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

            return { total, data: preparedData }
        } catch (error) {
            ApiHelper.throwErrorMessage(`Ошибка получения списка треков: ${error.message}`)
        }
    }

    /**
     * Получение списка популярных треков исполнителя по ID
     */
    async listArtistTopTracks(id, offset, limit) {
        try {
            const accessToken = await this.getValidToken()
            const response = await axios.get(`${this.artistsTopApiUrl}/${id}/top-tracks`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { limit, offset }
            })

            const trackData = response.data
            const tracks = trackData.tracks

            if (!tracks.length) {
                console.log('Данные не найдены')
                return { total: 0, data: [] }
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

            return { total: 10, data: preparedData }
        } catch (error) {
            ApiHelper.throwErrorMessage(`Ошибка получения списка треков: ${error.message}`)
        }
    }

    /**
     * Получение списка треков альбома по ID
     */
    async listAlbumTracks(id) {
        try {
            const accessToken = await this.getValidToken()
            const response = await axios.get(`${this.albumsApiUrl}/${id}/tracks`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            const albumData = response.data
            const total = albumData.total
            const albums = albumData.items

            if (!albums.length) {
                console.log('Данные не найдены')
                return { total: 0, data: [] }
            }

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

            return { total, data: preparedData }
        } catch (error) {
            ApiHelper.throwErrorMessage(`Ошибка получения списка треков: ${error.message}`)
        }
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
                console.log(stdout)
                console.log(stderr)
                
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
        console.log(url)

        await this.downloadFile(url)

        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const folderPath = path.join(__dirname, '../', 'assets', artistName, albumName)

        try {
            await fs.promises.mkdir(folderPath, { recursive: true })
            const files = await fs.promises.readdir(folderPath)
            const musicFile = files.find((file) => path.extname(file) === '.m4a')
            const serverFolderPath = path.join('http://localhost:5000', 'assets', artistName, albumName)

            return `${serverFolderPath}/${musicFile}`
        } catch (error) {
            console.log(error)
            return ''
        }
    }
}

export default SpotifyService
