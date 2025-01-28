import Artist from '../models/artist.model.js'
import Album from '../models/album.model.js'
import Track from '../models/track.model.js'

import ArtistAlbum from '../models/artistAlbum.model.js'
import ArtistTrack from '../models/artistTrack.model.js'
import AlbumTrack from '../models/albumTrack.model.js'

export const associateModels = () => {
    Artist.associate({ Album, Track, ArtistAlbum, ArtistTrack })
    Album.associate({ Artist, Track, ArtistAlbum, AlbumTrack })
    Track.associate({ Artist, Album, ArtistTrack, AlbumTrack })
}
