export class ExtensionModel{
    public name: string;
    public description: string;
    public version: string;
    public author: string;
    public authorUrl: string;
    public url: string;
    public id: string;
    public storage: Object | {} = {};
    
    constructor(name: string, description: string, version: string, author: string, authorUrl: string, url: string, folder: string){
        this.name = name;
        this.description = description;
        this.version = version;
        this.author = author;
        this.authorUrl = authorUrl;
        this.url = url;
        this.id = folder;
    }
}