import sector from './sector';
import section from './section';
import device from './device';

const payload = {
    ...sector,
    ...section,
    ...device,
};
export default payload;