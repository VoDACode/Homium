import express from 'express';
import extensions from './services/extensions';

const router = express.Router();
const logger = new (require('./services/logger'))('Router');

// API routes
router.use('/api', (req, res, next) => {   
    if(req.originalUrl.startsWith('/api/extensions') || req.originalUrl.startsWith('/api/controllers')){
        return next();
    }
    logger.debug('API request: ', req.originalUrl);
    let url = req.headers.referer;
    url = url?.replace(req.hostname, '').replace('http://', '').replace('https://', '');
    let urlParts = url?.split('/');
    if(urlParts?.[1] == 'extensions'){
        let extensionName = urlParts?.[2];
        let extension = extensions.get(extensionName, 'name');
        if(extension){
            logger.debug('Redirecting to extensions/', extension.name + req.originalUrl);
            res.redirect(308, '/extensions/' + extension.name + req.originalUrl);
        }else{
            logger.debug('Extension not found');
            res.send('Extension not found');
        }
    }else{
        logger.debug('Redirecting to api/controllers/', req.originalUrl.replace('/api', ''));
        res.redirect(308, '/api/controllers' + req.originalUrl.replace('/api', ''));
    }
});

// Static files
router.use('/static', (req, res, next) => {
    if(req.originalUrl.startsWith('/static') && req.originalUrl != '/static'){
        return next();
    }
    logger.debug('Static request: ', req.originalUrl);
    let url = req.headers.referer;
    url = url?.replace(req.hostname, '').replace('http://', '').replace('https://', '');
    let urlParts = url?.split('/');
    if(urlParts?.[1] == 'extensions'){
        let extensionName = urlParts?.[2];
        let extension = extensions.get(extensionName, 'name');
        if(extension){
            logger.debug('Redirecting to extensions/', extension.name + req.originalUrl);
            res.redirect(308, '/extensions/' + extension.name + req.originalUrl);
        }else{
            logger.debug('Extension not found');
            res.send('Extension not found');
        }
    }else{
        logger.debug('Redirecting to app/static/', req.originalUrl.replace('/static', ''));
        res.redirect(308, '/app/static' + req.originalUrl.replace('/static', ''));
    }
});

module.exports = router;