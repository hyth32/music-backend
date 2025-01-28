import axios from 'axios'
import ApiHelper from '../helpers/api.helper.js'
import ConfigHelper from '../helpers/config.helper.js'
import accessTokenInstance from '../instances/accessToken.instance.js'

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
     * Обший метод поиска
     */
    async search(type, phrase, offset, limit) {
        try {
            return await this.getList(type, phrase, offset, limit)
        } catch (error) {
            ApiHelper.throwErrorMessage(`Ошибка: ${error.message}`)
        }
    }
}

export default SpotifyService
