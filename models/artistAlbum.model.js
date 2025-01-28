import { Model, DataTypes } from '@sequelize/core'
import { sequelize } from '../db'

class ArtistAlbum extends Model { }

ArtistAlbum.init(
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
        album_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'artist_album',
        modelName: 'ArtistAlbum',
        timestamps: false,
    }
)

export default ArtistAlbum
