export class ObjectModel{
    public name: string;
    public parentId: string | null;
    public children: string[] = [];
    public id: string;
    public description: string | null;
    public object: any;
    public allowAnonymous: boolean;
    public systemObject: boolean;
    
    constructor(name: string, parentId: string | null, id: string, description: string | null, object: any, allowAnonymous: boolean = false, systemObject: boolean = false){
        this.name = name;
        this.parentId = parentId;
        this.id = id;
        this.description = description;
        this.object = object;
        this.allowAnonymous = allowAnonymous;
        this.systemObject = systemObject;
    }
}