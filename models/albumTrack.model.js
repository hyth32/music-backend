import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class AlbumTrack extends BaseModel {
    static async createNew(album_id, track_id) {
        return await this.findOrCreate({
            where: { album_id, track_id },
            defaults: { album_id, track_id },
        })
    }
}

AlbumTrack.createModel('album_track', false, {
    album_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    track_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

export default AlbumTrack
