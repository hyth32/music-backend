import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class Album extends BaseModel {
    static associate(models) {
        this.belongsToMany(models.Artist, {
            through: models.ArtistAlbum,
            foreignKey: 'album_id',
            otherKey: 'artist_id',
            as: 'artists',
        })

        this.belongsToMany(models.Track, {
            through: models.AlbumTrack,
            foreignKey: 'album_id',
            otherKey: 'track_id',
            as: 'tracks',
        })
    }

    getArtistNames() {
        if (this.artists.length > 1) {
            return this.artists.map(artist => artist.name).join(', ')
        }
        return this.artists[0].name 
    }
}

Album.createModel('album', false, {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    }
})

export default Album
