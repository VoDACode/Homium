import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Accordion from "../components/Accordion/Accordion";
import InputBox from "../components/InputBox/InputBox";
import SaveOrCancelForm from "../components/SaveOrCancelForm/SaveOrCancelForm";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { useNavigate } from "react-router-dom";
import { ApiUsers } from "../services/api/users";

class DefaultPermissions {
    constructor(val = false) {
        this.isAdministrator = val;
        this.user = {
            read: val,
            update: val,
            remove: val,
            create: val
        };
        this.script = {
            read: val,
            create: val,
            execute: val,
            remove: val
        };
        this.object = {
            read: val,
            create: val,
            update: val,
            remove: val,
            canUse: val
        };
        this.scense = {
            create: val,
            update: val,
            remove: val
        };
        this.devices = {
            read: val,
            create: val,
            update: val,
            remove: val,
            canUse: val
        };
    }
}

const UserEditPage = () => {
    const navigate = useNavigate();
    let { username } = useParams();

    const [canChange, setCanChange] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState([]);
    const [userData, setUserData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        enabled: false,
        password: ""
    });
    const [selfUser, setSelfUser] = useState({});
    const [selfPermissions, setSelfPermissions] = useState(new DefaultPermissions());
    const [permissions, setPermissions] = useState(new DefaultPermissions());
    const [permissionsEnabled, setPermissionsEnabled] = useState(new DefaultPermissions());

    useEffect(() => {
        setEditMode(username !== 'add');
        if (username !== 'add') {
            ApiUsers.getUser(username).then(data => {
                data.password = "";
                setUserData(data);
            });
            ApiUsers.getUserPermissions(username).then(data => {
                setPermissions(data);
            });
        }
        ApiUsers.getSelfPermissions().then(data => {
            if (username === 'add') {
                if (!data.user.create)
                    navToUserList();
            } else {
                setCanChange(data.user.update);
            }
            setSelfPermissions(data);
        });
        ApiUsers.getSeflUser().then(data => {
            setSelfUser(data);
        });
        disablePermissions();
    }, []);

    function switchParmission(prop) {
        setPermissions(prevState => {
            let data = { ...prevState };
            if (prop.includes('.')) {
                let [parent, child] = prop.split('.');
                data[parent][child] = !data[parent][child];
                return data;
            }
            data[prop] = !data[prop];
            return data;
        });
    }

    function inpuTextChange(e) {
        setUserData(prevState => {
            let data = { ...prevState };
            data[e.name] = e.value;
            return data;
        });
    }

    async function save() {
        let data = {
            username: userData.username,
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
            email: userData.email || "",
            enabled: userData.enabled || false,
            permissions: permissions
        };
        if (userData.password) {
            data.password = userData.password;
        }
        let response = (editMode ? await ApiUsers.updateUser(data) : await ApiUsers.createUser(data));
        if (response.ok) {
            navToUserList();
        } else {
            let data = await response.text();
            alert(data);
        }
    }

    async function disablePermissions() {
        if (username === 'add') {
            let selfUser = { ...selfPermissions };
            let tmpRes = new DefaultPermissions(true);
            tmpRes.isAdministrator = false;
            for (const key in selfUser) {
                if (Object.prototype.hasOwnProperty.call(selfUser, key) && typeof selfUser[key] === 'object') {
                    vP(selfUser, tmpRes, p => p[key]);
                    invert(tmpRes, p => p[key]);
                }
            }
            setPermissionsEnabled(tmpRes);
        } else {
            let user = await ApiUsers.getUserPermissions(username);
            let _selfUser = { ...selfUser }
            let _selfPermissions = { ...selfPermissions };
            if (user.isAdministrator === true || canChange === false || username == _selfUser.username) {
                for (const key in _selfPermissions) {
                    if (Object.prototype.hasOwnProperty.call(_selfPermissions, key) && typeof _selfPermissions[key] === 'object') {
                        vP(_selfPermissions, user, p => p[key], true, false);
                    }
                }
            } else if (user.isAdministrator === false && canChange === true) {
                for (const key in user) {
                    if (Object.prototype.hasOwnProperty.call(user, key) && typeof user[key] === 'object') {
                        vP(_selfPermissions, user, p => p[key], undefined, false);
                        invert(user, p => p[key]);
                    }
                }
            }
            setPermissionsEnabled(user);
        }
        function vP(input, output, getKey, defaultVal = undefined, inverse = false) {
            for (const key in getKey(output)) {
                if (Object.prototype.hasOwnProperty.call(getKey(output), key)) {
                    if (defaultVal !== undefined) {
                        getKey(output)[key] = defaultVal;
                    } else {
                        if (!inverse) {
                            getKey(output)[key] = getKey(input)[key];
                        } else {
                            getKey(output)[key] = !getKey(input)[key];
                        }
                    }
                }
            }
        }
        function invert(object, getKey) {
            for (const key in getKey(object)) {
                if (Object.prototype.hasOwnProperty.call(getKey(object), key)) {
                    getKey(object)[key] = !getKey(object)[key];
                }
            }
        }
    }

    const navToUserList = () => navigate('../');

    return (
        <ItemsContainer horizontal="center" vertical="center" width='100%'>
            <ItemsContainer horizontal="center" vertical="top" width='80%' margin={{ left: 'auto', right: 'auto' }}>
                <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                    <InputBox title="Username" name="username" value={userData?.username} disabled={editMode} required={true} onError={(e) => {
                        setErrors(prevState => {
                            let data = [...prevState];
                            data[0] = e;
                            return data;
                        });
                    }} onChange={inpuTextChange} />
                    <InputBox title="First Name" name="firstname" value={userData?.firstname} disabled={!canChange} onChange={inpuTextChange} />
                    <InputBox title="Last Name" name="lastname" value={userData?.lastname} disabled={!canChange} onChange={inpuTextChange} />
                    <InputBox title="Email" name="email" value={userData?.email} disabled={!canChange} onChange={inpuTextChange} />
                    <InputBox title="Password" type="password" name="password" disabled={!canChange} required={!editMode} placeholder="********" value={userData?.password} error={!editMode ? userData?.password.length < 8 : false} onChange={inpuTextChange} onError={(e) => {
                        setErrors(prevState => {
                            let data = [...prevState];
                            data[1] = e;
                            return data;
                        });
                    }} />
                    <InputBox title="Enabled" checked={userData?.enabled} disabled={permissions.isAdministrator || canChange === false || selfUser?.username === username} onClick={() => setUserData(prevState => {
                        let data = { ...prevState };
                        data.enabled = !data.enabled;
                        return data;
                    })} type="checkbox" />
                </ItemsContainer>
                <Accordion title={<h2>Permissions</h2>}>
                    <Accordion title={<h3>Users</h3>}>
                        <InputBox title="Can View" checked={permissions?.user.read} disabled={permissionsEnabled?.user.read} onClick={() => switchParmission("user.read")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.user.update} disabled={permissionsEnabled?.user.update} onClick={() => switchParmission("user.update")} type="checkbox" />
                        <InputBox title="Can Delete" checked={permissions?.user.remove} disabled={permissionsEnabled?.user.remove} onClick={() => switchParmission("user.remove")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.user.create} disabled={permissionsEnabled?.user.create} onClick={() => switchParmission("user.create")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Scripts</h3>}>
                        <InputBox title="Can View" checked={permissions?.script.read} disabled={permissionsEnabled?.script.read} onClick={() => switchParmission("script.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.script.create} disabled={permissionsEnabled?.script.create} onClick={() => switchParmission("script.create")} type="checkbox" />
                        <InputBox title="Can Execute" checked={permissions?.script.execute} disabled={permissionsEnabled?.script.execute} onClick={() => switchParmission("script.execute")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.script.remove} disabled={permissionsEnabled?.script.remove} onClick={() => switchParmission("script.remove")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Objects</h3>}>
                        <InputBox title="Can View" checked={permissions?.object.read} disabled={permissionsEnabled?.object.read} onClick={() => switchParmission("object.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.object.create} disabled={permissionsEnabled?.object.create} onClick={() => switchParmission("object.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.object.update} disabled={permissionsEnabled?.object.update} onClick={() => switchParmission("object.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.object.remove} disabled={permissionsEnabled?.object.remove} onClick={() => switchParmission("object.remove")} type="checkbox" />
                        <InputBox title="Can Use" checked={permissions?.object.canUse} disabled={permissionsEnabled?.object.canUse} onClick={() => switchParmission("object.canUse")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Scense</h3>}>
                        <InputBox title="Can Create" checked={permissions?.scense.create} disabled={permissionsEnabled?.scense.create} onClick={() => switchParmission("scense.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.scense.update} disabled={permissionsEnabled?.scense.update} onClick={() => switchParmission("scense.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.scense.remove} disabled={permissionsEnabled?.scense.remove} onClick={() => switchParmission("scense.remove")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Devices</h3>}>
                        <InputBox title="Can View" checked={permissions?.devices.read} disabled={permissionsEnabled?.devices.read} onClick={() => switchParmission("devices.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.devices.create} disabled={permissionsEnabled?.devices.create} onClick={() => switchParmission("devices.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.devices.update} disabled={permissionsEnabled?.devices.update} onClick={() => switchParmission("devices.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.devices.remove} disabled={permissionsEnabled?.devices.remove} onClick={() => switchParmission("devices.remove")} type="checkbox" />
                        <InputBox title="Can Use" checked={permissions?.devices.canUse} disabled={permissionsEnabled?.devices.canUse} onClick={() => switchParmission("devices.canUse")} type="checkbox" />
                    </Accordion>
                </Accordion>
                <SaveOrCancelForm onSave={async () => await save()} disabledSave={errors.includes(true)} onCancel={() => navToUserList()} />
            </ItemsContainer>
        </ItemsContainer>
    );
}

export default UserEditPage;