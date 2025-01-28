import { DataTypes } from '@sequelize/core'
import BaseModel from './base.model.js'

class ArtistTrack extends BaseModel { }

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
