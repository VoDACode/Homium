import React, { useEffect, useState } from "react";
import UserRecord from "../components/UserRecord/UserRecord";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import InputBox from "../components/InputBox/InputBox";
import { useNavigate } from 'react-router-dom';
import { ApiUsers } from "../services/api/users";

const UserAdministrationPage = () => {

    const [users, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [selfPermission, setSelfPermission] = useState({});
    const navigation = useNavigate();

    let items = [];

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        updateUsers();
        ApiUsers.getSelfPermissions().then(data => {
            setSelfPermission(data);
        });
    }, []);
    const updateUsers = () => {
        ApiUsers.getUsers().then(data => {
            setData(data);
        });
    }

    const navToAddUser = () => navigation('add');

    for (let i = 0; i < users.length; i++) {
        if(search !== '' && !users[i].username.toLowerCase().includes(search.toLowerCase()) && !users[i].firstname.toLowerCase().includes(search.toLowerCase()) && !users[i].lastname.toLowerCase().includes(search.toLowerCase())) {
            continue;
        }
        items.push(<UserRecord key={i} canEdit={selfPermission?.user?.update} canDelete={selfPermission?.user?.remove} username={users[i].username} firstname={users[i].firstname} lastname={users[i].lastname} onUpdate={updateUsers} />);
    }
    return (
        <ItemsContainer width="100%" margin={{ left: '5px', right: '5px', top: '5px' }}>
            <ItemsContainer width="100%">
                <InputBox width="100%" value={search} onChange={(e) => setSearch(e.value)} placeholder="Search" />
                {(selfPermission?.user?.create ? <InputBox type="button" value="Add User" onClick={() => navToAddUser()} /> : "")}
            </ItemsContainer>
            <ItemsContainer width="100%">
                {items}
            </ItemsContainer>
        </ItemsContainer>
    );
}

export default UserAdministrationPage;