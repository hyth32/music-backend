import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class ArtistAlbum extends BaseModel { }

ArtistAlbum.createModel('artist_album', false, {
    artist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    album_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

export default ArtistAlbum
