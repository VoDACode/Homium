import { ServiceEvent } from "../services/Service";

export type ObjectEventType = "loaded" | 'save' | 'saveObject' | 'clearCache' |
    'objectAdded' | 'objectRemoved' | 'objectUpdated' |
    'propertyUpdated' |
    'publishObjects' | 'publishObject' | 'publishObjectProperty' |
    ServiceEvent;