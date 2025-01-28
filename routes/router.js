import express from 'express'
import musicRouter from './music.router.js'

const router = express.Router()

router.use(musicRouter)

export default router
