import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DealModel } from './deal.model';

interface DealFileAttributes {
    id: number;
    dealId: number;
    fileUrl: string;
    fileName: string;
    fileType?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type DealFileCreationAttributes = Optional<DealFileAttributes, 'id'>;

export class DealFileModel extends Model<
    DealFileAttributes,
    DealFileCreationAttributes
> {
    id!: number;
    dealId!: number;
    fileUrl!: string;
    fileName!: string;
    fileType?: string;
    createdAt!: Date;
    updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof DealFileModel {
    DealFileModel.init(
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
                    model: DealModel,
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            fileUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fileType: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'deal_files',
            tableName: 'deal_files',
            timestamps: true,
        },
    );

    DealModel.hasMany(DealFileModel, {
        foreignKey: 'dealId',
        as: 'files',
    });
    DealFileModel.belongsTo(DealModel, {
        foreignKey: 'dealId',
        as: 'deal',
    });

    return DealFileModel;
}
