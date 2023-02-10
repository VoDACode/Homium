import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Accordion from "../components/Accordion/Accordion";
import InputBox from "../components/InputBox/InputBox";
import SaveOrCancelForm from "../components/SaveOrCancelForm/SaveOrCancelForm";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { useNavigate } from "react-router-dom";

const defaultPermissions = {
    isAdministrator: false,
    user: {
        read: false,
        update: false,
        remove: false,
        create: false
    },
    script: {
        read: false,
        create: false,
        execute: false,
        remove: false
    },
    object: {
        read: false,
        create: false,
        update: false,
        remove: false,
        canUse: false
    },
    scense: {
        create: false,
        update: false,
        remove: false
    },
    devices: {
        read: false,
        create: false,
        update: false,
        remove: false,
        canUse: false
    }
};

const UserEditPage = () => {
    const navigate = useNavigate();
    let { username } = useParams();

    const [error, setError] = useState(false);
    const [userData, setUserData] = useState({});
    const [permissions, setPermissions] = useState(defaultPermissions);
    const [permissionsEnabled, setPermissionsEnabled] = useState(defaultPermissions);

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
        if (await validatePermissions()) {
            let response = await fetch(`/api/users/list/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log(await response.json());
        }
    }

    useEffect(() => {
        fetch(`/api/users/list/${username}`)
            .then(response => response.json())
            .then(data => {
                setUserData(data);
            }).catch(error => {
                console.log(error);
            });
        fetch(`/api/users/list/${username}/permissions`)
            .then(response => response.json())
            .then(data => {
                setPermissions(data);
                console.log(data);
            }).catch(error => {
                console.log(error);
            });
        disablePermissions();
    }, []);

    async function validatePermissions() {
        let response = await fetch(`/api/users/list/self/permissions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let data = await response.json();
        if (data.isAdministrator)
            return true;
        if (data.isAdministrator === false && permissions.isAdministrator === true)
            return false;
        for (const key in permissions) {
            if (Object.prototype.hasOwnProperty.call(permissions, key) && typeof permissions[key] === 'object') {
                if (!vP(permissions, p => p[key])) {
                    return false;
                }
            }
        }
        function vP(p, getKey) {
            for (const key in getKey(p)) {
                if (Object.prototype.hasOwnProperty.call(getKey(p), key)) {
                    const element = getKey(p)[key];
                    if (typeof element !== 'boolean' || (element === true && getKey(permissions)[key] === false)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    async function disablePermissions() {
        let response = await fetch(`/api/users/list/${username}/permissions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let data = await response.json();
        let tmpRes = { ...permissionsEnabled };
        if (data.isAdministrator === false) {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key) && typeof data[key] === 'object') {
                    vP(data, p => p[key]);
                }
            }
        } else {
            tmpRes.isAdministrator = true;
        }
        setPermissionsEnabled(tmpRes);
        function vP(p, getKey) {
            for (const key in getKey(p)) {
                if (Object.prototype.hasOwnProperty.call(getKey(p), key)) {
                    const element = getKey(p)[key];
                    if (typeof element !== 'boolean' || (element === true && getKey(p)[key] === false)) {
                        getKey(tmpRes)[key] = false;
                    }
                }
            }
        }
    }

    const navToUserList = () => navigate('../');

    return (
        <ItemsContainer horizontal="center" vertical="center" width='100%'>
            <ItemsContainer horizontal="center" vertical="top" width='80%' margin={{ left: 'auto', right: 'auto' }}>
                <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                    <InputBox title="Username" name="username" value={userData?.username} required={true} onError={(e) => {
                        setError(e);
                    }} onChange={inpuTextChange} />
                    <InputBox title="First Name" name="firstname" value={userData?.firstname} onChange={inpuTextChange} />
                    <InputBox title="Last Name" name="lastname" value={userData?.lastname} onChange={inpuTextChange} />
                    <InputBox title="Email" name="email" value={userData?.email} onChange={inpuTextChange} />
                    <InputBox title="Enabled" checked={userData?.enabled} disabled={permissions.isAdministrator} onClick={() => setUserData(prevState => {
                        let data = { ...prevState };
                        data.enabled = !data.enabled;
                        return data;
                    })} type="checkbox" />
                </ItemsContainer>
                <Accordion title={<h2>Permissions</h2>}>
                    <Accordion title={<h3>Users</h3>}>
                        <InputBox title="Can View" checked={permissions?.user.read} disabled={!permissionsEnabled?.user.read} onClick={() => switchParmission("user.read")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.user.update} disabled={!permissionsEnabled?.user.update} onClick={() => switchParmission("user.update")} type="checkbox" />
                        <InputBox title="Can Delete" checked={permissions?.user.remove} disabled={!permissionsEnabled?.user.remove} onClick={() => switchParmission("user.remove")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.user.create} disabled={!permissionsEnabled?.user.create} onClick={() => switchParmission("user.create")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Scripts</h3>}>
                        <InputBox title="Can View" checked={permissions?.script.read} disabled={!permissionsEnabled?.script.read} onClick={() => switchParmission("script.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.script.create} disabled={!permissionsEnabled?.script.create} onClick={() => switchParmission("script.create")} type="checkbox" />
                        <InputBox title="Can Execute" checked={permissions?.script.execute} disabled={!permissionsEnabled?.script.execute} onClick={() => switchParmission("script.execute")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.script.remove} disabled={!permissionsEnabled?.script.remove} onClick={() => switchParmission("script.remove")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Objects</h3>}>
                        <InputBox title="Can View" checked={permissions?.object.read} disabled={!permissionsEnabled?.object.read} onClick={() => switchParmission("object.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.object.create} disabled={!permissionsEnabled?.object.create} onClick={() => switchParmission("object.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.object.update} disabled={!permissionsEnabled?.object.update} onClick={() => switchParmission("object.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.object.remove} disabled={!permissionsEnabled?.object.remove} onClick={() => switchParmission("object.remove")} type="checkbox" />
                        <InputBox title="Can Use" checked={permissions?.object.canUse} disabled={!permissionsEnabled?.object.canUse} onClick={() => switchParmission("object.canUse")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Scense</h3>}>
                        <InputBox title="Can Create" checked={permissions?.scense.create} disabled={!permissionsEnabled?.scense.create} onClick={() => switchParmission("scense.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.scense.update} disabled={!permissionsEnabled?.scense.update} onClick={() => switchParmission("scense.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.scense.remove} disabled={!permissionsEnabled?.scense.remove} onClick={() => switchParmission("scense.remove")} type="checkbox" />
                    </Accordion>
                    <Accordion title={<h3>Devices</h3>}>
                        <InputBox title="Can View" checked={permissions?.devices.read} disabled={!permissionsEnabled?.devices.read} onClick={() => switchParmission("devices.read")} type="checkbox" />
                        <InputBox title="Can Create" checked={permissions?.devices.create} disabled={!permissionsEnabled?.devices.create} onClick={() => switchParmission("devices.create")} type="checkbox" />
                        <InputBox title="Can Edit" checked={permissions?.devices.update} disabled={!permissionsEnabled?.devices.update} onClick={() => switchParmission("devices.update")} type="checkbox" />
                        <InputBox title="Can Remove" checked={permissions?.devices.remove} disabled={!permissionsEnabled?.devices.remove} onClick={() => switchParmission("devices.remove")} type="checkbox" />
                        <InputBox title="Can Use" checked={permissions?.devices.canUse} disabled={!permissionsEnabled?.devices.canUse} onClick={() => switchParmission("devices.canUse")} type="checkbox" />
                    </Accordion>
                </Accordion>
                <SaveOrCancelForm onSave={async () => await save()} disabledSave={error} onCancel={() => navToUserList()} />
            </ItemsContainer>
        </ItemsContainer>
    );
}

export default UserEditPage;