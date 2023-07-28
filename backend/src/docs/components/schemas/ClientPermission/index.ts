import ClientBasePermission from './ClientBasePermission.json';
import ClientPermissions from './ClientPermissions.json';
import ClientPermissionExecute from './ClientPermissionExecute.json';
import ClientPermissionObject from './ClientPermissionObject.json';
import ClientPermissionScene from './ClientPermissionScene.json';
import ClientPermissionDevice from "./ClientPermissionDevice.json";
import ClientPermissionExtension from "./ClientPermissionExtension.json";
import Templates from './Templates.json';

const payload = {
    "ClientPermission": {
        ...ClientBasePermission,
        ...ClientPermissions,
        ...ClientPermissionExecute,
        ...ClientPermissionObject,
        ...ClientPermissionScene,
        ...ClientPermissionDevice,
        ...ClientPermissionExtension,
        ...Templates
    }
}

export default payload;