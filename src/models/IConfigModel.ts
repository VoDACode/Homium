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
    mqtt: {
        enabled: boolean;
        host: string;
        port: number;
        user: string;
        password: string;
    },
    DEBUG: {
        debug: boolean;
        allowAnonymous: boolean;
    }
}