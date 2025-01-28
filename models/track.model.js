import { DataTypes } from "@sequelize/core"
import BaseModel from "./base.model.js"

class Track extends BaseModel {
    static associate(models) {
        this.belongsToMany(models.Artist, {
            through: models.ArtistTrack,
            foreignKey: 'track_id',
            otherKey: 'artist_id',
            as: 'artists',
        })

        this.belongsToMany(models.Album, {
            through: models.AlbumTrack,
            foreignKey: 'track_id',
            otherKey: 'album_id',
            as: 'albums',
        })
    }
}

Track.createModel('track', false, {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

export default Track
