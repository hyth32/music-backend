import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class Artist extends BaseModel {
    static associate(models) {
        this.belongsToMany(models.Track, {
            through: models.ArtistTrack,
            foreignKey: 'artist_id',
            otherKey: 'track_id',
            as: 'tracks',
        })

        this.belongsToMany(models.Album, {
            through: models.ArtistAlbum,
            foreignKey: 'artist_id',
            otherKey: 'album_id',
            as: 'albums',
        })
    }

    static async createNew(name, spotify_url) {
        return await this.findOrCreate({
            where: { name, spotify_url },
            defaults: { name, spotify_url },
        })
    }
}

Artist.createModel('artist', false, {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    spotify_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

export default Artist
