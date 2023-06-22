import signin from "./signin";
import signout from "./signout";
import refresh from "./refresh";
import status from "./status";

const payload = {
    ...signin,
    ...signout,
    ...refresh,
    ...status
};

export default payload;