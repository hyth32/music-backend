import { Model, DataTypes } from '@sequelize/core'
import { sequelize } from '../db.js'

class BaseModel extends Model {
    static capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    static getModelName(tableName) {
        const nameArr = tableName.split('_')
        return nameArr.map(part => this.capitalizeFirstLetter(part)).join('')
    }

    static createModel(tableName, timestamps, attributes = {}) {
        this.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                },
                ...attributes,
            },
            {
                sequelize,
                tableName: tableName,
                modelName: this.getModelName(tableName),
                timestamps,
            }
        )
        return this
    }
}

export default BaseModel
