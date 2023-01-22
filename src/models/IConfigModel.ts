export interface IConfigModel {
    server: {
        port: number;
    };
    db: {
        name(name: any): import("mongodb").MongoClient;
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    },
    DEBUG: {
        debug: boolean;
        allowAnonymous: boolean;
    }
}