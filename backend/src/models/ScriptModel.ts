export type ScriptTargetEvent = "init" | "update" | "stop" | "start" | "call" | "remove" | string;
export type ScriptTargetType = "Object" | "Extension" | "System";
export type ScriptArgument = { [key: string]: any}

export class ScriptModel{
    id: string;
    name: string;
    description: string = "";
    code: string;
    targetEvent: ScriptTargetEvent;
    targetType: ScriptTargetType;
    targetId: string = "";
    enabled: boolean = true;

    // If true, the script will be executed without any user interaction
    allowAnonymous: boolean = false;

    constructor(id: string, name: string, code: string, targetEvent: ScriptTargetEvent, targetType: ScriptTargetType, tagretId: string = ""){
        this.id = id;
        this.name = name;
        this.code = code;
        this.targetEvent = targetEvent;
        this.targetType = targetType;
        this.targetId = tagretId;
    }
}