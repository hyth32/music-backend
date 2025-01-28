import ConfigHelper from '../helpers/config.helper.js'

const apiMiddleware = (req, res, next) => {
    // if (req.url.startsWith('/api')) {        
    //     const apiKey = req.headers['apikey']
    
    //     if (!apiKey) {
    //         return res.status(403).json({ message: 'ApiKey is missing' })
    //     }
    
    //     if (apiKey !== ConfigHelper.getApiKey()) {
    //         return res.status(403).json({ message: 'Invalid ApiKey' })
    //     }
    // }
    next()
}

export default apiMiddleware
