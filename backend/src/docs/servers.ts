import { serviceManager, IConfigService } from 'homium-lib/services';
import ip from 'ip';

const configService = serviceManager.get(IConfigService);

const payload = {
    "servers": [
        {
            "url": "http://" + ip.address() + ":" + configService.config.server.port,
            "description": "Local network server"
        },
        {
            "url": "http://localhost:" + configService.config.server.port,
            "description": "Local server"
        },
        {
            "url": "http://api.homium.vodacode.space",
            "description": "Production server"
        }
    ]
};

export default payload;