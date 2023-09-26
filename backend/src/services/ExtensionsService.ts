import { IExtensionsService } from "homium-lib/services";
import { Extension } from "homium-lib/extension";
import { ExtensionModel } from "homium-lib/models";

class ExtensionExpanded{
    extension: Extension;
    original: any;
    info: ExtensionModel;
    folder: string;
    constructor(extension: Extension, original: any, info: ExtensionModel, folder: string) {
        this.extension = extension;
        this.original = original;
        this.info = info;
        this.folder = folder;
    }
}

export class ExtensionsService implements IExtensionsService{
    private extensions: ExtensionExpanded[] = [];

    get count(): number {
        return this.extensions.length;
    }

    get getContext(): any {
        let context: any = {};
        this.extensions.forEach(e => {
            context[e.extension.name.replace('-', "")] = e.original;
        });
        return context;
    }

    add(extension: Extension, original: any, info: ExtensionModel, folder: string): void {
        if(!(original.__proto__ instanceof Extension)){
            throw new Error("Extension must be inherited from Extension");
        }
        if(this.extensions.findIndex(e => e.info.id == info.id) != -1)
            return;
        if(this.extensions.findIndex((e) => e.extension.name == extension.name) != -1){
            return;
        }
        this.extensions.push(new ExtensionExpanded(extension, original, info, folder));
    }

    getOriginal(name: string, searchBy: 'name' | 'folder' | 'id'): any {
        if(searchBy == 'name'){
            return this.extensions.find((e) => e.extension.name === name)?.original;
        }else if(searchBy == 'folder'){
            return this.extensions.find((e) => e.folder === name)?.original;
        }else if(searchBy == 'id'){
            return this.extensions.find((e) => e.info.id === name)?.original;
        }
    }

    get(name: string, searchBy: 'name' | 'folder' | 'id'): Extension | undefined {
        if(searchBy == 'name'){
            return this.extensions.find((e) => e.extension.name === name)?.extension;
        }else if(searchBy == 'folder'){
            return this.extensions.find((e) => e.folder === name)?.extension;
        }else if(searchBy == 'id'){
            return this.extensions.find((e) => e.info.id === name)?.extension;
        }
    }

    reload(name: string, searchBy: 'name' | 'folder' | 'id'): boolean {
        let extension = this.get(name, searchBy);
        if(extension){
            extension.restart();
            return true;
        }
        return false;
    }

    remove(name: string, searchBy: 'name' | 'folder' | 'id'): boolean {
        let extension = this.get(name, searchBy);
        if(extension){
            extension.stop();
            this.extensions = this.extensions.filter((e) => e.extension.name !== name);
            return true;
        }
        return false;
    }

    any(name: string, searchBy: 'name' | 'folder' | 'id'): boolean {
        return this.get(name, searchBy) != undefined;
    }

    addEventListener(name: string, searchBy: 'name' | 'folder' | 'id', event: string, callback: (...args: any[]) => void): void {
        let extension = this.get(name, searchBy);
        extension?.on(event, callback);
    }

    removeEventListener(name: string, searchBy: 'name' | 'folder' | 'id', event: string, callback: (...args: any[]) => void): void {
        let extension = this.get(name, searchBy);
        extension?.off(event, callback);
    }

    get allInfo(): ExtensionModel[] {
        return this.extensions.map((e) => e.info);
    }
}