import { Model, DataTypes } from "@sequelize/core"
import { sequelize } from '../db.js'

class Track extends Model {
    static associate(models) {
        Track.belongsToMany(models.Artist, {
            through: models.ArtistTrack,
            foreignKey: 'track_id',
            otherKey: 'artist_id',
            as: 'artists',
        })

        Track.belongsToMany(models.Album, {
            through: models.AlbumTrack,
            foreignKey: 'track_id',
            otherKey: 'album_id',
            as: 'albums',
        })
    }
}

Track.init(
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
        tableName: 'track',
        modelName: 'Track',
        timestamps: false,
    }
)

export default Track
