import { OTP } from '@/interfaces/user.interfaces';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type OtpCreationAttributes = Optional<OTP, 'id' | 'email'>;

export class OtpModel extends Model<OTP, OtpCreationAttributes> implements OTP {
    public id?: string;
    public email!: string;
    public otp!: string;
    public isUsed!: boolean;
    public expiresAt!: string | undefined;

    public created_at: string | undefined;
    public updated_at: string | undefined;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

export default function (sequelize: Sequelize): typeof OtpModel {
    OtpModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            isUsed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'otp',
            sequelize,
            timestamps: true,
        },
    );

    return OtpModel;
}
