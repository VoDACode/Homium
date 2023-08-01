import auth from './paths/auth';
import users from './paths/users';
import object from './paths/object';
import structures from './paths/structures';

const payload = {
    "paths": {
        ...auth,
        ...users,
        ...object,
        ...structures,
    },
};

export default payload;