import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class AlbumTrack extends BaseModel { }

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
