import config from '../config';
import ip from 'ip';

const payload = {
    "servers": [
        {
            "url": "http://" + ip.address() + ":" + config.data.server.port,
            "description": "Local network server"
        },
        {
            "url": "http://localhost:" + config.data.server.port,
            "description": "Local server"
        },
        {
            "url": "http://api.homium.vodacode.space",
            "description": "Production server"
        }
    ]
};

export default payload;