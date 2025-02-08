import { DataTypes } from "@sequelize/core"
import BaseModel from "./base.model.js"

class Track extends BaseModel {
    static associate(models) {
        this.belongsTo(models.Album, {
            through: models.AlbumTrack,
            foreignKey: 'id',
            otherKey: 'album_id',
            as: 'album',
        })
    }

    static async createNew(name, spotify_url) {
        return await this.findOrCreate({
            where: { name, spotify_url },
            defaults: { name, spotify_url }
        })
    }

    static async getAlbum(spotify_url) {
        const trackRecord = await this.findOne({
            where: { spotify_url },
            include: { association: this.associations.albums }
        })

        return trackRecord.albums[0]
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
