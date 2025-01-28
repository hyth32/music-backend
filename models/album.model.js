import { Model, DataTypes } from '@sequelize/core'
import { sequelize } from '../db.js'

class Album extends Model {
    static associate(models) {
        Album.belongsToMany(models.Artist, {
            through: models.ArtistAlbum,
            foreignKey: 'album_id',
            otherKey: 'artist_id',
            as: 'artists',
        })

        Album.belongsToMany(models.Track, {
            through: models.AlbumTrack,
            foreignKey: 'album_id',
            otherKey: 'track_id',
            as: 'tracks',
        })
    }
}

Album.init(
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
        },
        year: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        }
    }, 
    {
        sequelize,
        tableName: 'album',
        modelName: 'Album',
        timestamps: false,
    }
)