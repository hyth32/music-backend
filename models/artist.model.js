import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class Artist extends BaseModel {
    static associate(models) {
        Artist.belongsToMany(models.Track, {
            through: models.ArtistTrack,
            foreignKey: 'artist_id',
            otherKey: 'track_id',
            as: 'tracks',
        })

        Artist.belongsToMany(models.Album, {
            through: models.ArtistAlbum,
            foreignKey: 'artist_id',
            otherKey: 'album_id',
            as: 'albums',
        })
    }
}

Artist.createModel('artist', false, {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

export default Artist
