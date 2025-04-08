import { Sequelize, DataTypes, Model } from 'sequelize';
import { UserModel } from './user.model';
import { DealModel } from './deal.model';

export class CustomAudienceModel extends Model {
    userId!: number;
    dealId!: number;
}

export default function (sequelize: Sequelize): typeof CustomAudienceModel {
    CustomAudienceModel.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            dealId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'deals',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'custom_audiences',
        },
    );

    // Defining the relationships between models
    UserModel.belongsToMany(DealModel, {
        through: CustomAudienceModel,
        foreignKey: 'userId',
        otherKey: 'dealId',
    });

    DealModel.belongsToMany(UserModel, {
        through: CustomAudienceModel,
        foreignKey: 'dealId',
        otherKey: 'userId',
    });

    return CustomAudienceModel;
}
