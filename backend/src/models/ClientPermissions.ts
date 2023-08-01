export class ClientCreatePermission {
    create: boolean;

    constructor(create: boolean) {
        this.create = create;
    }
}

export class ClientReadPermission {
    read: boolean;

    constructor(read: boolean) {
        this.read = read;
    }
}

export class ClientRemovePermission {
    remove: boolean;

    constructor(remove: boolean) {
        this.remove = remove;
    }
}

export class ClientUpdatePermission {
    update: boolean;

    constructor(update: boolean) {
        this.update = update;
    }
}

export class ClientCanUsePermission {
    canUse: boolean;

    constructor(canUse: boolean) {
        this.canUse = canUse;
    }
}

export class ClientBasePermission implements ClientCreatePermission, ClientReadPermission, ClientRemovePermission, ClientUpdatePermission {
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

export class ClientPermissionDevice extends ClientBasePermission {
    canUse: boolean;

    constructor(create: boolean, read: boolean, update: boolean, remove: boolean, canUse: boolean) {
        super(create, read, update, remove);
        this.canUse = canUse;
    }
};

export class ClientPermissionScene implements ClientCreatePermission, ClientUpdatePermission, ClientRemovePermission {
    remove: boolean;
    update: boolean;
    create: boolean;

    constructor(create: boolean, update: boolean, remove: boolean) {
        this.create = create;
        this.update = update;
        this.remove = remove;
    }
};

export class ClientPermissionExecute implements ClientCreatePermission, ClientReadPermission, ClientRemovePermission {
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

export class ClientPermissionObject implements ClientBasePermission, ClientCanUsePermission {
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


export class ClientPermissionExtension implements ClientReadPermission, ClientRemovePermission, ClientCanUsePermission {
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

export class ClientPermissions {
    user: ClientBasePermission;
    script: ClientPermissionExecute;
    object: ClientPermissionObject;
    scene: ClientPermissionScene;
    devices: ClientPermissionDevice;
    extensions: ClientPermissionExtension;
    isAdministrator: boolean = false;

    constructor(deff: boolean = false) {
        this.user = new ClientBasePermission(deff, deff, deff, deff);
        this.script = new ClientPermissionExecute(deff, deff, deff, deff);
        this.object = new ClientPermissionObject(deff, deff, deff, deff, deff);
        this.scene = new ClientPermissionScene(deff, deff, deff);
        this.devices = new ClientPermissionDevice(deff, deff, deff, deff, deff);
        this.extensions = new ClientPermissionExtension(deff, deff, deff, deff, deff);
    }
};

export type PermissionTemplate = 'admin' | 'guest' | 'controlPanel' | 'userDevice' | 'defaultUser';