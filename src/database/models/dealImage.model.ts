import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DealModel } from './deal.model';

interface DealImageAttributes {
    id: number;
    dealId: number;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface DealImageCreationAttributes
    extends Optional<DealImageAttributes, 'id'> {}

export class DealImageModel extends Model<
    DealImageAttributes,
    DealImageCreationAttributes
> {
    id!: number;
    dealId!: number;
    imageUrl!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof DealImageModel {
    DealImageModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            dealId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: DealModel, // Reference DealModel for the dealId
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'deal_images',
            tableName: 'deal_images',
            timestamps: true,
        },
    );
    DealModel.hasMany(DealImageModel, {
        foreignKey: 'dealId',
        as: 'images',
    });
    DealImageModel.belongsTo(DealModel, {
        foreignKey: 'dealId',
        as: 'deal',
    });

    return DealImageModel;
}
