import { IExtension } from "../types/IExtension";

class ExtansionExpanded{
    extension: IExtension;
    folder: string;
    constructor(extension: IExtension, folder: string) {
        this.extension = extension;
        this.folder = folder;
    }
}

class ExtensionsStorage{
    private constructor() { }
    private static _instance: ExtensionsStorage;
    public static get instance(): ExtensionsStorage {
        return this._instance || (this._instance = new this());
    }

    private extensions: ExtansionExpanded[] = [];

    get count(): number {
        return this.extensions.length;
    }

    add(extension: IExtension, folder: string){
        if(!this.extensions.find((e) => e.extension.name === extension.name) || !this.extensions.find((e) => e.folder === folder)){
            return;
        }
        this.extensions.push(new ExtansionExpanded(extension, folder));
    }

    get(name: string, searchBy: 'name' | 'folder'): IExtension | undefined {
        if(searchBy == 'name'){
            return this.extensions.find((e) => e.extension.name === name)?.extension;
        }else if(searchBy == 'folder'){
            return this.extensions.find((e) => e.folder === name)?.extension;
        }
    }

    reload(name: string, searchBy: 'name' | 'folder'): boolean {
        let extension = this.get(name, searchBy);
        if(extension){
            extension.stop();
            extension.run();
            return true;
        }
        return false;
    }

    remove(name: string, searchBy: 'name' | 'folder'): boolean {
        let extension = this.get(name, searchBy);
        if(extension){
            extension.stop();
            this.extensions = this.extensions.filter((e) => e.extension.name !== name);
            return true;
        }
        return false;
    }

    any(name: string, searchBy: 'name' | 'folder'): boolean {
        return this.get(name, searchBy) != undefined;
    }
}

export default ExtensionsStorage.instance;