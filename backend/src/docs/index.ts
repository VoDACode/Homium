import baseInfo from './basicInfo';
import servers from './servers';
import tags from './tags';
import paths from './paths';
import components from './components';

const payload = {
    ...baseInfo,
    ...servers,
    ...tags,
    ...paths,
    ...components,
};

export default payload;