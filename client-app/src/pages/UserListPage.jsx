import React, { useEffect, useState } from "react";
import UserRecord from "../components/UserRecord/UserRecord";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import InputBox from "../components/InputBox/InputBox";
import { useNavigate } from 'react-router-dom';
import { ApiUsers } from "../services/api/users";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import TableHeader from "../components/TableHeader/TableHeader";
import Space from "../components/Space/Space";

const UserListPage = () => {

    const [users, setUsers] = useState([]);
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
            setUsers(data);
        });
    }

    const navToAddUser = () => navigation('add');

    for (let i = 0; i < users.length; i++) {
        if(search !== '' && !users[i].username.toLowerCase().includes(search.toLowerCase()) && !users[i].firstname.toLowerCase().includes(search.toLowerCase()) && !users[i].lastname.toLowerCase().includes(search.toLowerCase())) {
            continue;
        }
        items.push(
            <div key={i}>
                <Space size="20px"/>
                <UserRecord canEdit={selfPermission?.user?.update} canDelete={selfPermission?.user?.remove} username={users[i].username} firstname={users[i].firstname} lastname={users[i].lastname} email={users[i].email} onUpdate={updateUsers} />
            </div>
        );
    }
    return (
        <ItemsContainer width="100%" margin={{ left: '5px', right: '5px', top: '5px' }}>
            <CustomHeader text="User list" textColor="#0036a3" textSize="45px" isCenter={true}/>
            <ItemsContainer width="100%">
                <InputBox width="100%" value={search} onChange={(e) => setSearch(e.value)} placeholder="Search" />
                {(selfPermission?.user?.create ? <InputBox type="button" value="Add User" onClick={() => navToAddUser()} /> : "")}
            </ItemsContainer>
            <Space size="30px"/>
            <ItemsContainer width="98%">
                <TableHeader components={['username', 'first name', 'last name', 'email', 'actions']} gridMarkUpCols='1fr 0.5fr 1fr 1fr 1fr'/>
                {items}
            </ItemsContainer>
        </ItemsContainer>
    );
}

export default UserListPage;
