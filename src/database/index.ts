import logger from '@/utils/logger';
import Sequelize from 'sequelize';
import userModel from './models/user.model';
import categoryModel from './models/category.model';
import roleModel from './models/role.model';
import UserRoleModel from './models/userrole.model';
import FavoriteDealsModel from './models/favoritedeal.model';
import UserFollowModel from './models/UserFollow.model';
import OtpModel from './models/otp.model';
import NotificationModel from './models/notification.model';


import DealModel from './models/deal.model';

import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    NODE_ENV,
} from '@/config';
import dealImageModel from './models/dealImage.model';
import commentsModel from './models/comments.model';
import dealFileModel from './models/dealFile.model';
import cityModel from './models/city.model';
import dealCitiesModel from './models/dealCities.model';
import messageModel from './models/message.model';
import conversationModel from './models/conversation.model';
import customAudienceModel from './models/customAudience.model';

export const sequelize = new Sequelize.Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: (DB_DIALECT as Sequelize.Dialect) || 'postgres',
        host: DB_HOST,
        port: parseInt(DB_PORT as string, 10),
        timezone: '+09:00',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            // underscored: true, //https://sequelize.org/docs/v6/other-topics/naming-strategies/
            freezeTableName: true,
        },
        pool: {
            min: 0,
            max: 5,
        },
        logQueryParameters: NODE_ENV === 'development',
        logging: (query, time) => {
            logger.info(time + 'ms' + ' ' + query);
        },
        benchmark: true,
    },
);

sequelize.authenticate();

export const DB = {
    User: userModel(sequelize),
    Role: roleModel(sequelize),
    UserRole: UserRoleModel(sequelize),
    Categories: categoryModel(sequelize),
    Cities: cityModel(sequelize),
    UserFollowModel: UserFollowModel(sequelize),
    Deals: DealModel(sequelize),
    DealImages: dealImageModel(sequelize),
    FavoriteDeal: FavoriteDealsModel(sequelize),
    Comments: commentsModel(sequelize),
    DealFiles: dealFileModel(sequelize),
    DealCities: dealCitiesModel(sequelize),
    Messages: messageModel(sequelize),
    Conversations: conversationModel(sequelize),
    CustomAudienceModel: customAudienceModel(sequelize),
    Otp: OtpModel(sequelize),
    Notification: NotificationModel(sequelize),
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};
