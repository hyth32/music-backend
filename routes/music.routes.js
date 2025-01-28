import express from 'express'
import MusicController from '../controllers/music.controller.js'

const router = express.Router()
const musicController = new MusicController()

router.get('/tracks', musicController.listTracks.bind(musicController))

export default router
