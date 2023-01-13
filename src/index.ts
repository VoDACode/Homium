import express from 'express';
import path from 'path';
import * as config from './config';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as boot from './boot';

const app = express();
const port = config.getConfig().server.port || process.env.PORT;

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/app/static", express.static(path.join(__dirname, 'static')));

boot.loadControllers();
boot.bootExtensions();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});