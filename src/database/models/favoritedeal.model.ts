import { FavoriteDeal } from '@/interfaces/user.interfaces';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserModel } from './user.model';
import { DealModel } from './deal.model';

type favoriteDealCreationAttributes = Optional<FavoriteDeal, 'id'>;

export class FavoriteDealsModel
    extends Model<FavoriteDeal, favoriteDealCreationAttributes>
    implements FavoriteDeal
{
    public userId!: number;
    public dealId!: number;
    public created_at: string | undefined;
    public updated_at: string | undefined;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof FavoriteDealsModel {
    FavoriteDealsModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: 'favorite_deals__unique_constraint',
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            dealId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: 'favorite_deals__unique_constraint',
                references: {
                    model: 'deals',
                    key: 'id',
                },
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'favorite_deal',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );
    DealModel.belongsToMany(UserModel, {
        foreignKey: 'dealId',
        otherKey: 'userId',
        through: FavoriteDealsModel,
        as: 'interestedUsers',
    });
    UserModel.belongsToMany(DealModel, {
        foreignKey: 'userId',
        otherKey: 'dealId',
        through: FavoriteDealsModel,
        // as: 'dealsInIntrest',
    });

    return FavoriteDealsModel;
}
