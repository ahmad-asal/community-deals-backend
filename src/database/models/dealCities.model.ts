import { Sequelize, DataTypes, Model } from 'sequelize';
import { DealModel } from './deal.model';
import { CityModel } from './city.model';

export class DealCitiesModel extends Model {
    dealId!: number;
    cityId!: number;
}

export default function (sequelize: Sequelize): typeof DealCitiesModel {
    DealCitiesModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            dealId: {
                type: DataTypes.INTEGER,
                references: {
                    model: DealModel,
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            cityId: {
                type: DataTypes.INTEGER,
                references: {
                    model: CityModel,
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'deal_cities',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );

    DealModel.belongsToMany(CityModel, {
        through: DealCitiesModel,
        foreignKey: 'dealId',
        otherKey: 'cityId',
    });
    CityModel.belongsToMany(DealModel, {
        through: DealCitiesModel,
        foreignKey: 'cityId',
        otherKey: 'dealId',
    });

    return DealCitiesModel;
}
