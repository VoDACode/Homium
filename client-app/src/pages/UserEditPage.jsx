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
    
    const { username } = useParams();

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

    async function disablePermissions(selfUserPermissions, selfUser) {
        if (username === 'add') {
            let tmpRes = new DefaultPermissions(true);
            tmpRes.isAdministrator = false;
            for (const key in selfUserPermissions) {
                if (Object.prototype.hasOwnProperty.call(selfUserPermissions, key) && typeof selfUserPermissions[key] === 'object') {
                    vP(selfUserPermissions, tmpRes, p => p[key]);
                    if(selfUserPermissions.isAdministrator === false){
                        invert(tmpRes, p => p[key]);
                    }
                }
            }
            setPermissionsEnabled(selfUserPermissions.isAdministrator ? new DefaultPermissions(false) : tmpRes);
        } else {
            let user = await ApiUsers.getUserPermissions(username);
            if (user.isAdministrator === true || canChange === false || username === selfUser.username) {
                for (const key in selfUserPermissions) {
                    if (Object.prototype.hasOwnProperty.call(selfUserPermissions, key) && typeof selfUserPermissions[key] === 'object') {
                        vP(selfUserPermissions, user, p => p[key], true, false);
                    }
                }
            } else if (user.isAdministrator === false && canChange === true) {
                for (const key in user) {
                    if (Object.prototype.hasOwnProperty.call(user, key) && typeof user[key] === 'object') {
                        vP(selfUserPermissions, user, p => p[key], undefined, false);
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
        ApiUsers.getSelfPermissions().then(permissions => {
            if (username === 'add') {
                if (!permissions.user.create)
                    navToUserList();
            } else {
                setCanChange(permissions.user.update);
            }
            setSelfPermissions(permissions);
            ApiUsers.getSelfUser().then(user => {
                setSelfUser(user);
                disablePermissions(permissions, user);
            });
        });
    }, []);

    return (
        <ItemsContainer horizontal="center" vertical="center" width='100%'>
            <CustomHeader text={username === 'add' ? 'New user' : 'User editing'} textColor="#0036a3" textSize="45px" isCenter={true} />
            <Space size="10px" />
            <ItemsContainer horizontal="center" vertical="top" width='80%' margin={{ left: 'auto', right: 'auto' }}>
                <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                    <InputBox title="Username *" name="username" value={userData?.username} width="300px" disabled={editMode} required={true} onError={(e) => {
                        setErrors(prevState => {
                            let data = [...prevState];
                            data[0] = e;
                            return data;
                        });
                    }} onChange={inputTextChange} />
                    <InputBox title="First Name" name="firstname" value={userData?.firstname} width="300px" disabled={!canChange} onChange={inputTextChange} />
                    <InputBox title="Last Name" name="lastname" value={userData?.lastname} width="300px" disabled={!canChange} onChange={inputTextChange} />
                    <InputBox title="Email" name="email" value={userData?.email} width="300px" disabled={!canChange} onChange={inputTextChange} />
                    <InputBox title="Password *" type="password" name="password" width="300px" disabled={!canChange} required={!editMode} placeholder="********" value={userData?.password} error={!editMode ? userData?.password.length < 8 : false} onChange={inputTextChange} onError={(e) => {
                        setErrors(prevState => {
                            let data = [...prevState];
                            data[1] = e;
                            return data;
                        });
                    }} />
                    <InputBox title="Enabled" width="50px" isHeaderLeft={true} checked={userData?.enabled} disabled={permissions.isAdministrator || canChange === false || selfUser?.username === username} onClick={() => setUserData(prevState => {
                        let data = { ...prevState };
                        data.enabled = !data.enabled;
                        return data;
                    })} type="checkbox" />
                </ItemsContainer>
                <Accordion title={<h2>Permissions</h2>}>
                    <Accordion title={<h3>Users</h3>}>
                        <InputBox title="Can View" checked={permissions?.user.read} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.user.read} onClick={() => switchPermission("user.read")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.user.update} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.user.update} onClick={() => switchPermission("user.update")} type="checkbox" />
                        <InputBox title="Can Delete" checked={permissions?.user.remove} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.user.remove} onClick={() => switchPermission("user.remove")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.user.create} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.user.create} onClick={() => switchPermission("user.create")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Scripts</h3>}>
                        <InputBox title="Can View" checked={permissions?.script.read} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.script.read} onClick={() => switchPermission("script.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.script.create} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.script.create} onClick={() => switchPermission("script.create")} type="checkbox" />
                        <InputBox title="Can Execute" checked={permissions?.script.execute} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.script.execute} onClick={() => switchPermission("script.execute")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.script.remove} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.script.remove} onClick={() => switchPermission("script.remove")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Objects</h3>}>
                        <InputBox title="Can View" checked={permissions?.object.read} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.object.read} onClick={() => switchPermission("object.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.object.create} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.object.create} onClick={() => switchPermission("object.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.object.update} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.object.update} onClick={() => switchPermission("object.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.object.remove} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.object.remove} onClick={() => switchPermission("object.remove")} type="checkbox" />
                        <InputBox title="Can Use" checked={permissions?.object.canUse} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.object.canUse} onClick={() => switchPermission("object.canUse")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Scene</h3>}>
                        <InputBox title="Can Create" checked={permissions?.scene.create} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.scene.create} onClick={() => switchPermission("scene.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.scene.update} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.scene.update} onClick={() => switchPermission("scene.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.scene.remove} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.scene.remove} onClick={() => switchPermission("scene.remove")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Devices</h3>}>
                        <InputBox title="Can View" checked={permissions?.devices.read} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.devices.read} onClick={() => switchPermission("devices.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.devices.create} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.devices.create} onClick={() => switchPermission("devices.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.devices.update} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.devices.update} onClick={() => switchPermission("devices.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.devices.remove} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.devices.remove} onClick={() => switchPermission("devices.remove")} type="checkbox" />
                        <InputBox title="Can Use" checked={permissions?.devices.canUse} width="50px" isHeaderLeft={true} disabled={permissionsEnabled?.devices.canUse} onClick={() => switchPermission("devices.canUse")} type="checkbox" />
                    </Accordion>
                </Accordion>
                <SaveOrCancelForm onSave={async () => await save()} disabledSave={errors.includes(true)} onCancel={() => navToUserList()} />
                <Space size="25px" />
            </ItemsContainer>
        </ItemsContainer>
    );
}

export default UserEditPage;
