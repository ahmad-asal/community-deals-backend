import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import router from '@routes/routes';
import logger from '@utils/logger';
import { DB } from '@database/index';
import { PORT, BASE_URL } from './config';
import { errorHandler } from './utils/error-handler';
import { swaggerSpec, swaggerUi } from './utils/swagger';
import path from 'path';

const appServer = express();
const server = createServer(appServer);
const io = new Server(server, {
    cors: { origin: '*' },
});

const port = PORT;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

appServer.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
            logger.error(message);
        } else if (res.statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });

    next();
});

// Middleware
appServer.use(cors(corsOptions));
appServer.options('*', cors(corsOptions));
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: true }));
appServer.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
appServer.use('/api', router);

// Serve frontend (production)
if (process.env.NODE_ENV === 'production') {
    appServer.use(express.static(path.join(__dirname, '../../fe_build')));
    appServer.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../../', 'fe_build', 'index.html'),
        ),
    );
} else {
    appServer.get('/', (req, res) => res.send('Please set to production'));
}

appServer.use(errorHandler);

// WebSocket logic
io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('messagesRead', async ({ userId, conversationId }) => {
        try {
            io.emit(`updateUnreadCount-${userId}`);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });

    // Send Message
    socket.on('sendMessage', async messageData => {
        try {
            const { conversationId, senderId, content, receiverId } =
                messageData;

            const response = await axios.post(`${BASE_URL}/api/messages`, {
                conversationId,
                senderId,
                content,
            });

            const savedMessage = response.data;
            // Emit message to all clients in the conversation
            io.emit(`receiveMessage-${conversationId}`, savedMessage);

            // Notify the receiver of new messages and unread count
            io.emit(`updateConversations-${receiverId}`);
            io.emit(`updateUnreadCount-${receiverId}`);
        } catch (error) {
            console.error('Error saving message via API:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

DB.sequelize
    .authenticate()
    .then(() => {
        logger.info('Database connected successfully!');
        server.listen(port, () => {
            logger.info(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        logger.error('Unable to connect to the database:', error);
    });
