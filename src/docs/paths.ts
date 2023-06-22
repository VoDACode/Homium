import auth from './paths/auth';
import users from './paths/users';
import object from './paths/object';

const payload = {
    "paths": {
        ...auth,
        ...users,
        ...object
    },
};

export default payload;