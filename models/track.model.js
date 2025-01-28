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

        this.belongsTo(models.Album, {
            through: models.AlbumTrack,
            foreignKey: 'track_id',
            otherKey: 'album_id',
            as: 'album',
        })
    }

    toJSON() {
        return {
            artist: this.album.getArtistNames(),
            duration: this.duration_ms,
            name: this.name,
            url: this.external_urls.spotify,
        }
    }
}

Track.createModel('track', false, {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    spotify_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    file_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    }
})

export default Track
