import { Express } from 'express';
import { serviceManager, ILogger } from 'homium-lib/services';
import swaggerUi from 'swagger-ui-express';

export const swagger = (app: Express) => {
    const docs = require('../docs');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs.default));
    const logger = serviceManager.get(ILogger, 'Swagger');
    logger.info('Swagger initialized');
}

export default swagger;