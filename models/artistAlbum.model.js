import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class ArtistAlbum extends BaseModel {
    static async createNew(artist_id, album_id) {
        return await this.findOrCreate({
            where: { artist_id, album_id },
            defaults: { artist_id, album_id },
        })
    }
}

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
