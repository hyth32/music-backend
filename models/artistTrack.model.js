import { Model, DataTypes } from '@sequelize/core'
import { sequelize } from '../db.js'

class ArtistTrack extends Model { }

ArtistTrack.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        artist_id: {
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
        tableName: 'artist_track',
        modelName: 'ArtistTrack',
        timestamps: false,
    }
)

export default ArtistTrack
