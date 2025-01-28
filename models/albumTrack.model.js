import { Model, DataTypes } from '@sequelize/core'
import { sequelize } from '../db.js'

class AlbumTrack extends Model { }

AlbumTrack.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        album_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        track_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'album_track',
        modelName: 'AlbumTrack',
        timestamps: false,
    }
)

export default AlbumTrack
