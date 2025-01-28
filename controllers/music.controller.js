import ApiHelper from '../helpers/api.helper.js'
import Track from '../models/track.model.js'
import Artist from '../models/artist.model.js'
import Album from '../models/album.model.js'
import ArtistAlbum from '../models/artistAlbum.model.js'
import ArtistTrack from '../models/artistTrack.model.js'
import AlbumTrack from '../models/albumTrack.model.js'
import SpotifyService from '../services/spotify.service.js'

class MusicController {
    constructor() {
        this.spotifyService = new SpotifyService()
    }
    
    /**
     * Получение списка треков по поисковому запросу
     */
    async listTracks(req, res, next) {
        const { q, offset = 0, limit = 10 } = req.query

        try {
            const rawTracks = await this.spotifyService.search('track', q, offset, limit)

            const trackData = rawTracks.data.tracks
            const total = trackData.total
            const tracks = trackData.items

            if (!tracks.length) {
                console.log('Данные не найдены')
                return []
            }

            tracks.forEach(async track => {
                const trackRecord = await Track.findOrCreate({
                    where: {
                        name: track.name,
                        spotify_url: track.external_urls.spotify,
                    },
                    defaults: {
                        name: track.name,
                        spotify_url: track.external_urls.spotify,
                    }
                })

                const albumRecord = await Album.findOrCreate({
                    where: {
                        name: track.album.name,
                        year: track.album.release_date,
                        tracks_count: track.album.total_tracks,
                        spotify_url: track.album.external_urls.spotify,
                        image_url: track.album.images ? track.album.images[0].url : null
                    },
                    defaults: {
                        name: track.album.name,
                        year: track.album.release_date,
                        tracks_count: track.album.total_tracks,
                        spotify_url: track.album.external_urls.spotify,
                        image_url: track.album.images ? track.album.images[0].url : null
                    },
                })

                await AlbumTrack.findOrCreate({
                    where: {
                        album_id: albumRecord[0].id,
                        track_id: trackRecord[0].id,
                    },
                    defaults: {
                        album_id: albumRecord[0].id,
                        track_id: trackRecord[0].id,
                    },
                })

                track.artists.forEach(async artist => {
                    const artistRecord = await Artist.findOrCreate({
                        where: {
                            name: artist.name,
                            spotify_url: artist.external_urls.spotify,
                        },
                        defaults: {
                            name: artist.name,
                            spotify_url: artist.external_urls.spotify,
                        },
                    })

                    await ArtistAlbum.findOrCreate({
                        where: {
                            artist_id: artistRecord[0].id,
                            album_id: albumRecord[0].id,
                        },
                        defaults: {
                            artist_id: artistRecord[0].id,
                            album_id: albumRecord[0].id,
                        },
                    })

                    await ArtistTrack.findOrCreate({
                        where: {
                            artist_id: artistRecord[0].id,
                            track_id: trackRecord[0].id,
                        },
                        defaults: {
                            artist_id: artistRecord[0].id,
                            track_id: trackRecord[0].id,
                        },
                    })
                })
            })
    
            ApiHelper.sendData(res, {
                total,
                data: [],
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
