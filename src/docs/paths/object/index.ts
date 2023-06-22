import get from './get';
import create from './create';
import remove from './remove';
import update from './update';
import list from './list';
import search from './search';

const payload = {
    ...get,
    ...create,
    ...remove,
    ...update,
    ...list,
    ...search
}

export default payload;