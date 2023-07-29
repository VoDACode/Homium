import {Express} from 'express';
import swaggerUi from 'swagger-ui-express';
import { Logger } from '../services/LogService';


const logger = new Logger('swagger');

export const swagger = (app: Express) => {
    const docs = require('../docs');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs.default));
    logger.info('Swagger initialized');
}

export default swagger;