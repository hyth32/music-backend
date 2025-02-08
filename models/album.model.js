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

    static async createNew(name, year, tracks_count, spotify_url, image_url = null) {
        return await this.findOrCreate({
            where: { name, year, tracks_count, spotify_url, image_url },
            defaults: { name, year, tracks_count, spotify_url, image_url },
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
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    tracks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    spotify_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    }
})

export default Album
