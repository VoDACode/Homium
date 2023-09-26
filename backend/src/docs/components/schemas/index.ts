import signin from './signin.json';
import ClientPermission from './ClientPermission';
import UserView from './UserView.json';
import UserCreate from './UserCreate.json';
import UserUpdate from './UserUpdate.json';
import object from './object';
import structures from './structures';
import ExtensionInfo from './ExtensionInfo.json';

const payload = {
    ...signin,
    ...UserView,
    ...UserCreate,
    ...UserUpdate,
    ...ClientPermission,
    ...object,
    ...structures,
    ...ExtensionInfo,
}

export default payload;