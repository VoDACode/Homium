import ObjectPropertyHistory from "./ObjectPropertyHistory.json";
import MqttProperty from "./MqttProperty.json";
import CreateObject from "./CreateObject.json";
import ObjectProperty from "./ObjectProperty.json";
import UpdateObject from "./UpdateObject.json";
import ListObjects from "./ListObjects.json";
import SearchObjectResult from "./SearchObjectResult.json";

const payload = {
    "Object": {
        ...ObjectPropertyHistory,
        ...MqttProperty,
        ...CreateObject,
        ...ObjectProperty,
        ...UpdateObject,
        ...ListObjects,
        ...SearchObjectResult
    }
};
export default payload;