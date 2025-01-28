import { Model, DataTypes } from '@sequelize/core'
import { sequelize } from '../db.js'

class Artist extends Model {
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

Artist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'artist',
        modelName: 'Artist',
        timestamps: false,
    }
)

export default Artist
