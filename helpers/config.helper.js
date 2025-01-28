import dotenv from 'dotenv'
const { error, parsed } = dotenv.config()
if (error) {
    console.error(`Ошибка dotenv: ${error.message}`)
}

class ConfigHelper {
    static getDBConfig() {
        return {
            user: parsed.DB_USER,
            password: parsed.DB_PASSWORD,
            database: parsed.DB_NAME,
            host: parsed.DB_HOST,
            port: parsed.DB_PORT,
            dialect: parsed.DB_DIALECT,
        }
    }

    static getAppPort() {
        return parsed.PORT
    }

    static getApiKey() {
        return parsed.API_KEY
    }

    static getSpotifyConfig() {
        return {
            client_id: parsed.CLIENT_ID,
            client_secret: parsed.CLIENT_SECRET,
        }
    }

    static prepareSpotifyParams() {
        const spotifyConfig = this.getSpotifyConfig()
        const params = new URLSearchParams()
        params.append('grant_type', 'client_credentials')
        params.append('client_id', spotifyConfig.client_id)
        params.append('client_secret', spotifyConfig.client_secret)

        return params
    }
}

export default ConfigHelper
