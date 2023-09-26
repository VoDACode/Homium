import auth from './paths/auth';
import users from './paths/users';
import object from './paths/object';
import structures from './paths/structures';
import extensions from './paths/extensions';

const payload = {
    "paths": {
        ...auth,
        ...users,
        ...object,
        ...structures,
        ...extensions,
    },
};

export default payload;