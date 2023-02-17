import React, { useEffect, useState } from "react";
import UserRecord from "../components/UserRecord/UserRecord";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import InputBox from "../components/InputBox/InputBox";
import { useNavigate } from 'react-router-dom';
import { ApiUsers } from "../services/api/users";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import TableHeader from "../components/TableHeader/TableHeader";
import Space from "../components/Space/Space";
import ModalWindow from "../components/ModalWindow/ModalWindow";
import DeleteUserPanel from "../components/DeleteUserPanel/DeleteUserPanel";

const UserListPage = () => {

    const [isModWinVisible, setModWinVisibility] = useState(false);
    const [users, setUsers] = useState([]);
    const [usernameForDelete, setDeletingUsername] = useState(null);
    const [search, setSearch] = useState('');
    const [selfPermission, setSelfPermission] = useState({});

    const navigation = useNavigate();
    const navToAddUser = () => navigation('add');
    
    function DeleteUserRequest(username) {
        setModWinVisibility(true);
        setDeletingUsername(username);
    }

    function DeleteUser(username) {
        ApiUsers.deleteUser(username).then(response => {
            if (response.status === 200) {
                setModWinVisibility(false);
                UpdateUsers();
            } else {
                alert(response.text());
            }
        });
    }

    function UpdateUsers() {
        ApiUsers.getUsers().then(data => {
            setUsers(data);
        });
    }

    function RenderUserList() {
        var res = [];

        for (let i = 0; i < users.length; i++) {
            if (search !== '' && !users[i].username.toLowerCase().includes(search.toLowerCase()) &&
                !users[i].firstname.toLowerCase().includes(search.toLowerCase()) &&
                !users[i].lastname.toLowerCase().includes(search.toLowerCase())) {
                continue;
            }
            res.push(
                <div key={i}>
                    <Space size="20px" />
                    <UserRecord
                        OnEditClick={() => navigation(`/admin/users/${users[i].username}`)}
                        OnDeleteClick={() => DeleteUserRequest(users[i].username)}
                        canEdit={selfPermission?.user?.update}
                        canDelete={selfPermission?.user?.remove}
                        username={users[i].username}
                        firstname={users[i].firstname}
                        lastname={users[i].lastname}
                        email={users[i].email} />
                </div>
            );
        }

        return res;
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateUsers();
        ApiUsers.getSelfPermissions().then(data => {
            setSelfPermission(data);
        });
    }, []);

    return (
        <div>
            <ModalWindow visible={isModWinVisible}>
                <DeleteUserPanel usernameForDel={usernameForDelete} onDeleteClick={DeleteUser} onCancelClick={() => setModWinVisibility(false)} />
            </ModalWindow>
            <CustomHeader text="User list" textColor="#0036a3" textSize="45px" isCenter={true} />
            <ItemsContainer width="100%">
                <InputBox width="100%" value={search} onChange={(e) => setSearch(e.value)} placeholder="Search" />
                {(selfPermission?.user?.create ? <InputBox type="button" value="Add User" onClick={() => navToAddUser()} /> : "")}
            </ItemsContainer>
            <Space size="30px" />
            <ItemsContainer width="98%">
                <TableHeader components={['username', 'first name', 'last name', 'email', 'actions']} gridMarkUpCols='1fr 0.5fr 1fr 1fr 1fr' />
                {RenderUserList()}
            </ItemsContainer>
        </div>
    );
}

export default UserListPage;
