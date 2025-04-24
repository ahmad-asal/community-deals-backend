import { Sequelize, DataTypes, Model } from 'sequelize';

export class CityModel extends Model {
    id!: number;
    name!: string;
    country!: string;
}

export default function (sequelize: Sequelize): typeof CityModel {
    CityModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'cities',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );

    // CityModel.belongsToMany(DealModel, {
    //     through: DealCitiesModel,
    //     foreignKey: 'cityId',
    //     otherKey: 'dealId',
    // });

    return CityModel;
}
