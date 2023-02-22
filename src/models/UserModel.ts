import { PermissionTemplate, ClientBasePermission, ClientPermissionDevice, ClientPermissionExecute, ClientPermissionExtension, ClientPermissionObject, ClientPermissions, ClientPermissionScene } from "./ClientPermissions";

export class UserModel {

    static readonly RESERVED_USERNAMES = ['admin', 'guest', 'controlPanel', 'userDevice', 'system', 'templates', 'add'];

    lastname: string;
    firstname: string;
    username: string;
    password: string;
    email: string | undefined = undefined;
    permissions: ClientPermissions = new ClientPermissions(false);
    enabled: boolean = true;
    expiresAt: Date = new Date();
    constructor(username: string, password: string, firstname: string | undefined = undefined, lastname: string | undefined = undefined, permissions: ClientPermissions, enabled: boolean | undefined = undefined) {
        this.username = username;
        this.password = password;
        this.firstname = firstname || "";
        this.lastname = lastname || "";
        this.permissions = permissions;
        this.enabled = enabled || true;
    }

    static readonly ADMIN_PERMISSIONS: ClientPermissions = this.getTemplatePermissions('admin');
    static readonly GUEST_PERMISSIONS: ClientPermissions = this.getTemplatePermissions('guest');
    static readonly CONTROL_PANEL_PERMISSIONS: ClientPermissions = this.getTemplatePermissions('controlPanel');
    static readonly USER_DEVICE_PERMISSIONS: ClientPermissions = this.getTemplatePermissions('userDevice');
    
    public static getTemplatePermissions(type: PermissionTemplate): ClientPermissions {
        let permissions: ClientPermissions = new ClientPermissions();
        switch (type) {
            case 'admin':
                permissions = new ClientPermissions(true);
                permissions.isAdministrator = true;
                break;
            case 'guest':
                permissions = new ClientPermissions(false);
                break;
            case 'defaultUser':
            case 'controlPanel':
                permissions.user = new ClientBasePermission(false, true, false, false);
                permissions.script = new ClientPermissionExecute(false, false, false, true);
                permissions.object = new ClientPermissionObject(false, true, false, false, true);
                permissions.scene = new ClientPermissionScene(false, false, false);
                permissions.devices = new ClientPermissionDevice(false, true, false, false, true);
                permissions.extensions = new ClientPermissionExtension(true, false, false, false, true);
                break;
            case 'userDevice':
                permissions.user = new ClientBasePermission(false, false, false, false);
                permissions.script = new ClientPermissionExecute(false, false, false, false);
                permissions.object = new ClientPermissionObject(false, true, false, false, true);
                permissions.scene = new ClientPermissionScene(false, false, false);
                permissions.devices = new ClientPermissionDevice(false, true, false, false, true);
                permissions.extensions = new ClientPermissionExtension(false, false, false, false, false);
                break;
            default:
                break;
            }
        return permissions;
    }
}

export class UserView {
    lastname: string;
    firstname: string;
    username: string;
    email: string | undefined;
    enabled: boolean;
    constructor(user: UserModel) {
        this.username = user.username;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.email = user.email;
        this.enabled = user.enabled;
    }
}