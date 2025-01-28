/**
 * Синглтон токена доступа Spotify
 */
class AccessToken {
    static instance

    constructor() {
        if (AccessToken.instance) {
            return AccessToken.instance
        }

        this.token = null
        this.expiresAt = null

        AccessToken.instance = this
    }

    /**
     * Установка параметров токена 
     */
    setToken(token, expiresIn) {
        this.token = token
        this.expiresAt = Date.now() + expiresIn * 1000
    }

    /**
     * Валидация токена по времени экспирации
     */
    isValid() {
        return this.token && Date.now() < this.expiresAt
    }

    /**
     * Получение токена
     */
    getToken() {
        if (this.isValid()) {
            return this.token
        }
        return null
    }
}

const accessTokenInstance = new AccessToken()

export default accessTokenInstance
