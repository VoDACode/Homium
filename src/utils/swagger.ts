import {Express, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import { Logger } from '../services/LogService';
const docs = require('../docs');

const logger = new Logger('swagger');

export const swagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs.default));
    logger.info('Swagger initialized');
}

export default swagger;