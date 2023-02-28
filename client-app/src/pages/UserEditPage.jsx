import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Accordion from "../components/Accordion/Accordion";
import InputBox from "../components/InputBox/InputBox";
import SaveOrCancelForm from "../components/SaveOrCancelForm/SaveOrCancelForm";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { useNavigate } from "react-router-dom";
import { ApiUsers } from "../services/api/users";
import Space from "../components/Space/Space";
import CustomHeader from "../components/CustomHeader/CustomHeader";

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
        this.scene = {
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
    const navToUserList = () => {
        navigate('/admin/users');
    };
    
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

    function switchPermission(prop) {
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

    function inputTextChange(e) {
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
            setPermissionsEnabled(selfUser.isAdministrator ? new DefaultPermissions(false) : tmpRes);
        } else {
            let user = await ApiUsers.getUserPermissions(username);
            let _selfUser = { ...selfUser }
            let _selfPermissions = { ...selfPermissions };
            if (user.isAdministrator === true || canChange === false || username === _selfUser.username) {
                for (const key in _selfPermissions) {
                    if (Object.prototype.hasOwnProperty.call(_selfPermissions, key) && typeof _selfPermissions[key] === 'object') {
                        vP(_selfPermissions, user, p => p[key], true, false);
                    }
                }
            } else if (user.isAdministrator === false && canChange === true) {
                for (const key in user) {
                    if (Object.prototype.hasOwnProperty.call(user, key) && typeof user[key] === 'object') {
                        vP(_selfPermissions, user, p => p[key], undefined, false);
                        if(selfUser.isAdministrator === false)
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

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';

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
        ApiUsers.getSelfUser().then(data => {
            setSelfUser(data);
        });
        disablePermissions();
    }, []);

    return (
        <ItemsContainer horizontal="center" vertical="center" width='100%'>
            <CustomHeader text={username === 'add' ? 'New user' : 'User editing'} textColor="#0036a3" textSize="45px" isCenter={true} />
            <Space size="10px" />
            <ItemsContainer horizontal="center" vertical="top" width='80%' margin={{ left: 'auto', right: 'auto' }}>
                <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                    <InputBox title="Username" name="username" value={userData?.username} disabled={editMode} required={true} onError={(e) => {
                        setErrors(prevState => {
                            let data = [...prevState];
                            data[0] = e;
                            return data;
                        });
                    }} onChange={inputTextChange} />
                    <InputBox title="First Name" name="firstname" value={userData?.firstname} disabled={!canChange} onChange={inputTextChange} />
                    <InputBox title="Last Name" name="lastname" value={userData?.lastname} disabled={!canChange} onChange={inputTextChange} />
                    <InputBox title="Email" name="email" value={userData?.email} disabled={!canChange} onChange={inputTextChange} />
                    <InputBox title="Password" type="password" name="password" disabled={!canChange} required={!editMode} placeholder="********" value={userData?.password} error={!editMode ? userData?.password.length < 8 : false} onChange={inputTextChange} onError={(e) => {
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
                        <InputBox title="Can View" checked={permissions?.user.read} disabled={permissionsEnabled?.user.read} onClick={() => switchPermission("user.read")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.user.update} disabled={permissionsEnabled?.user.update} onClick={() => switchPermission("user.update")} type="checkbox" />
                        <InputBox title="Can Delete" checked={permissions?.user.remove} disabled={permissionsEnabled?.user.remove} onClick={() => switchPermission("user.remove")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.user.create} disabled={permissionsEnabled?.user.create} onClick={() => switchPermission("user.create")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Scripts</h3>}>
                        <InputBox title="Can View" checked={permissions?.script.read} disabled={permissionsEnabled?.script.read} onClick={() => switchPermission("script.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.script.create} disabled={permissionsEnabled?.script.create} onClick={() => switchPermission("script.create")} type="checkbox" />
                        <InputBox title="Can Execute" checked={permissions?.script.execute} disabled={permissionsEnabled?.script.execute} onClick={() => switchPermission("script.execute")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.script.remove} disabled={permissionsEnabled?.script.remove} onClick={() => switchPermission("script.remove")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Objects</h3>}>
                        <InputBox title="Can View" checked={permissions?.object.read} disabled={permissionsEnabled?.object.read} onClick={() => switchPermission("object.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.object.create} disabled={permissionsEnabled?.object.create} onClick={() => switchPermission("object.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.object.update} disabled={permissionsEnabled?.object.update} onClick={() => switchPermission("object.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.object.remove} disabled={permissionsEnabled?.object.remove} onClick={() => switchPermission("object.remove")} type="checkbox" />
                        <InputBox title="Can Use" checked={permissions?.object.canUse} disabled={permissionsEnabled?.object.canUse} onClick={() => switchPermission("object.canUse")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Scene</h3>}>
                        <InputBox title="Can Create" checked={permissions?.scene.create} disabled={permissionsEnabled?.scene.create} onClick={() => switchPermission("scene.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.scene.update} disabled={permissionsEnabled?.scene.update} onClick={() => switchPermission("scene.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.scene.remove} disabled={permissionsEnabled?.scene.remove} onClick={() => switchPermission("scene.remove")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Devices</h3>}>
                        <InputBox title="Can View" checked={permissions?.devices.read} disabled={permissionsEnabled?.devices.read} onClick={() => switchPermission("devices.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.devices.create} disabled={permissionsEnabled?.devices.create} onClick={() => switchPermission("devices.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.devices.update} disabled={permissionsEnabled?.devices.update} onClick={() => switchPermission("devices.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.devices.remove} disabled={permissionsEnabled?.devices.remove} onClick={() => switchPermission("devices.remove")} type="checkbox" />
                        <InputBox title="Can Use" checked={permissions?.devices.canUse} disabled={permissionsEnabled?.devices.canUse} onClick={() => switchPermission("devices.canUse")} type="checkbox" />
                    </Accordion>
                </Accordion>
                <SaveOrCancelForm onSave={async () => await save()} disabledSave={errors.includes(true)} onCancel={() => navToUserList()} />
                <Space size="25px" />
            </ItemsContainer>
        </ItemsContainer>
    );
}

export default UserEditPage;
