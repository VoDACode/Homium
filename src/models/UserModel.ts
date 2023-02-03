export class UserCreatePermission {
    create: boolean;

    constructor(create: boolean) {
        this.create = create;
    }
}

export class UserReadPermission {
    read: boolean;

    constructor(read: boolean) {
        this.read = read;
    }
}

export class UserRemovePermission {
    remove: boolean;

    constructor(remove: boolean) {
        this.remove = remove;
    }
}

export class UserUpdatePermission {
    update: boolean;

    constructor(update: boolean) {
        this.update = update;
    }
}

export class UserCanUsePermission {
    canUse: boolean;

    constructor(canUse: boolean) {
        this.canUse = canUse;
    }
}

export class UserBasePermission implements UserCreatePermission, UserReadPermission, UserRemovePermission, UserUpdatePermission {
    update: boolean;
    remove: boolean;
    read: boolean;
    create: boolean;

    constructor(create: boolean, read: boolean, update: boolean, remove: boolean) {
        this.create = create;
        this.read = read;
        this.update = update;
        this.remove = remove;
    }
}

export class UserPermissionDevice extends UserBasePermission {
    canUse: boolean;

    constructor(create: boolean, read: boolean, update: boolean, remove: boolean, canUse: boolean) {
        super(create, read, update, remove);
        this.canUse = canUse;
    }
};

export class UserPermissionScense implements UserCreatePermission, UserUpdatePermission, UserRemovePermission {
    remove: boolean;
    update: boolean;
    create: boolean;

    constructor(create: boolean, update: boolean, remove: boolean) {
        this.create = create;
        this.update = update;
        this.remove = remove;
    }
};

export class UserPermissionExecute implements UserCreatePermission, UserReadPermission, UserRemovePermission {
    remove: boolean;
    read: boolean;
    create: boolean;
    execute: boolean;

    constructor(create: boolean, read: boolean, remove: boolean, execute: boolean) {
        this.create = create;
        this.read = read;
        this.remove = remove;
        this.execute = execute;
    }
};

export class UserPermissionObject implements UserBasePermission, UserCanUsePermission {
    update: boolean;
    create: boolean;
    remove: boolean;
    read: boolean;
    canUse: boolean;
    
    constructor(create: boolean, read: boolean, update: boolean, remove: boolean, canUse: boolean) {
        this.create = create;
        this.read = read;
        this.update = update;
        this.remove = remove;
        this.canUse = canUse;
    }
};


export class UserPermissionExtension implements UserReadPermission, UserRemovePermission, UserCanUsePermission {
    remove: boolean;
    read: boolean;
    download: boolean;
    canConfigure: boolean;
    canUse: boolean;

    constructor(read: boolean, remove: boolean, download: boolean, canConfigure: boolean, canUse: boolean) {
        this.read = read;
        this.remove = remove;
        this.download = download;
        this.canConfigure = canConfigure;
        this.canUse = canUse;
    }
}

export class UserPermissions {
    user: UserBasePermission;
    script: UserPermissionExecute;
    object: UserPermissionObject;
    scense: UserPermissionScense;
    devices: UserPermissionDevice;
    extensions: UserPermissionExtension;
    isAdministrator: boolean = false;

    constructor(deff: boolean = false) {
        this.user = new UserBasePermission(deff, deff, deff, deff);
        this.script = new UserPermissionExecute(deff, deff, deff, deff);
        this.object = new UserPermissionObject(deff, deff, deff, deff, deff);
        this.scense = new UserPermissionScense(deff, deff, deff);
        this.devices = new UserPermissionDevice(deff, deff, deff, deff, deff);
        this.extensions = new UserPermissionExtension(deff, deff, deff, deff, deff);
    }
};

export type PermissionTemplate = 'admin' | 'guest' | 'controlPanel' | 'userDevice' | 'defaultUser';

export class UserModel {

    static readonly RESERVED_USERNAMES = ['admin', 'guest', 'controlPanel', 'userDevice', 'system', 'templates'];

    lastname: string;
    firstname: string;
    username: string;
    password: string;
    email: string | undefined = undefined;
    permissions: UserPermissions = new UserPermissions(false);
    enabled: boolean = true;
    expiresAt: Date = new Date();
    constructor(username: string, password: string, firstname: string | undefined = undefined, lastname: string | undefined = undefined, permissions: UserPermissions, enabled: boolean | undefined = undefined) {
        this.username = username;
        this.password = password;
        this.firstname = firstname || "";
        this.lastname = lastname || "";
        this.permissions = permissions;
        this.enabled = enabled || true;
    }

    static readonly ADMIN_PERMISSIONS: UserPermissions = this.getTemplatePermissions('admin');
    static readonly GUEST_PERMISSIONS: UserPermissions = this.getTemplatePermissions('guest');
    static readonly CONTROL_PANEL_PERMISSIONS: UserPermissions = this.getTemplatePermissions('controlPanel');
    static readonly USER_DEVICE_PERMISSIONS: UserPermissions = this.getTemplatePermissions('userDevice');
    
    public static getTemplatePermissions(type: PermissionTemplate): UserPermissions {
        let permissions: UserPermissions = new UserPermissions();
        switch (type) {
            case 'admin':
                permissions = new UserPermissions(true);
                permissions.isAdministrator = true;
                break;
            case 'guest':
                permissions = new UserPermissions(false);
                break;
            case 'defaultUser':
            case 'controlPanel':
                permissions.user = new UserBasePermission(false, true, false, false);
                permissions.script = new UserPermissionExecute(false, false, false, true);
                permissions.object = new UserPermissionObject(false, true, false, false, true);
                permissions.scense = new UserPermissionScense(false, false, false);
                permissions.devices = new UserPermissionDevice(false, true, false, false, true);
                permissions.extensions = new UserPermissionExtension(true, false, false, false, true);
                break;
            case 'userDevice':
                permissions.user = new UserBasePermission(false, false, false, false);
                permissions.script = new UserPermissionExecute(false, false, false, false);
                permissions.object = new UserPermissionObject(false, true, false, false, true);
                permissions.scense = new UserPermissionScense(false, false, false);
                permissions.devices = new UserPermissionDevice(false, true, false, false, true);
                permissions.extensions = new UserPermissionExtension(false, false, false, false, false);
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
    constructor(user: UserModel) {
        this.username = user.username;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
    }
}