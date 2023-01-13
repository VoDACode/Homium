import express from 'express';
import extensions from './services/extensions';

const router = express.Router();


//TO DO
router.get('/sign-in', (req, res) => {
    res.sendFile('signin.html');
});

// API routes
router.use('/api', (req, res) => {
    let url = req.headers.referer;
    url = url?.replace(req.hostname, '').replace('http://', '').replace('https://', '');
    let urlParts = url?.split('/');
    if(urlParts?.[1] == 'extensions'){
        let extensionName = urlParts?.[2];
        let extension = extensions.get(extensionName, 'name');
        if(extension){
            res.redirect('/extensions/' + extension.name + req.originalUrl);
        }else{
            res.send('Extension not found');
        }
    }else{
        res.redirect('/api/controllers' + req.originalUrl.replace('/api', ''));
    }
});

// Static files
router.use('/static', (req, res) => {
    let url = req.headers.referer;
    url = url?.replace(req.hostname, '').replace('http://', '').replace('https://', '');
    let urlParts = url?.split('/');
    if(urlParts?.[1] == 'extensions'){
        let extensionName = urlParts?.[2];
        let extension = extensions.get(extensionName, 'name');
        if(extension){
            res.redirect('/extensions/' + extension.name + req.originalUrl);
        }else{
            res.send('Extension not found');
        }
    }else{
        res.redirect('/app/static' + req.originalUrl.replace('/static', ''));
    }
});

module.exports = router;