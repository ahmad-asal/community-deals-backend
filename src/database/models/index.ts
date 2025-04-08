import { CategoryModel } from './category.model';
import { ConversationModel } from './conversation.model';
import { DealModel } from './deal.model';
import { MessageModel } from './message.model';
import { UserModel } from './user.model';

// Define associations
DealModel.belongsTo(CategoryModel, {
    foreignKey: 'categoryId',
    as: 'category',
});
CategoryModel.hasMany(DealModel, { foreignKey: 'categoryId' });

UserModel.hasMany(MessageModel, { foreignKey: 'senderId', as: 'Messages' });
UserModel.hasMany(ConversationModel, {
    foreignKey: 'user1Id',
    as: 'ConversationsUser1',
});
UserModel.hasMany(ConversationModel, {
    foreignKey: 'user2Id',
    as: 'ConversationsUser2',
});

// Message associations
MessageModel.belongsTo(UserModel, { foreignKey: 'senderId', as: 'Sender' });
MessageModel.belongsTo(ConversationModel, {
    foreignKey: 'conversationId',
    as: 'Conversation',
});

// Conversation associations
ConversationModel.belongsTo(UserModel, { foreignKey: 'user1Id', as: 'User1' });
ConversationModel.belongsTo(UserModel, { foreignKey: 'user2Id', as: 'User2' });
ConversationModel.hasMany(MessageModel, {
    foreignKey: 'conversationId',
    as: 'Messages',
});

export { CategoryModel, DealModel, UserModel, MessageModel, ConversationModel };
