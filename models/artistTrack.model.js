import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class ArtistTrack extends BaseModel {
    static async createNew(artist_id, track_id) {
        return await this.findOrCreate({
            where: { artist_id, track_id },
            defaults: { artist_id, track_id },
        })
    }
}

ArtistTrack.createModel('artist_track', false, {
    artist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    track_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

export default ArtistTrack
