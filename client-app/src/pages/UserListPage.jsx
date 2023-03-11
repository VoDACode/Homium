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
import DeletePanel from "../components/DeletePanel/DeletePanel";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";

const UserListPage = () => {

    const [isListLoaded, setIsListLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [isModWinVisible, setModWinVisibility] = useState(false);
    const [usernameForDelete, setDeletingUsername] = useState(null);
    const [search, setSearch] = useState('');
    const [selfPermission, setSelfPermission] = useState({});
    const [sortMode, setSortMode] = useState({ parameter: '', dir: '' });

    const navigation = useNavigate();
    const navToAddUser = () => navigation('add');

    function SortUserList(list, mode) {
        var arr = [...list];

        switch (mode.parameter) {
            case 'username':
                arr.sort((a, b) => {
                    if (a.username.toLowerCase() < b.username.toLowerCase()) {
                        return mode.dir === 'asc' ? -1 : 1;
                    }
                    if (a.username.toLowerCase() > b.username.toLowerCase()) {
                        return mode.dir === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
                break;
            case 'firstname':
                arr.sort((a, b) => {
                    if (a.firstname.toLowerCase() < b.firstname.toLowerCase()) {
                        return mode.dir === 'asc' ? -1 : 1;
                    }
                    if (a.firstname.toLowerCase() > b.firstname.toLowerCase()) {
                        return mode.dir === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
                break;
            case 'lastname':
                arr.sort((a, b) => {
                    if (a.lastname.toLowerCase() < b.lastname.toLowerCase()) {
                        return mode.dir === 'asc' ? -1 : 1;
                    }
                    if (a.lastname.toLowerCase() > b.lastname.toLowerCase()) {
                        return mode.dir === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
                break;
            case 'email':
                arr.sort((a, b) => {
                    if (a.email.toLowerCase() < b.email.toLowerCase()) {
                        return mode.dir === 'asc' ? -1 : 1;
                    }
                    if (a.email.toLowerCase() > b.email.toLowerCase()) {
                        return mode.dir === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
                break;
            default:
                break;
        }

        return arr;
    }

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
            setIsListLoaded(true);
        });

        ApiUsers.getSelfPermissions().then(data => {
            setSelfPermission(data);
        });
    }

    function RenderUserList() {
        if (!isListLoaded)
            return (
                <div>
                    <Space size="20px" />
                    <LoadingAnimation size="70px" loadingCurveWidth="11px" isCenter={true} />
                </div>
            );

        var res = [];
        var fixedUsers = [];

        for (var i = 0; i < users.length; i++) {
            fixedUsers.push({
                username: users[i].username === '' || users[i].username === null ? '—' : users[i].username,
                firstname: users[i].firstname === '' || users[i].firstname === null ? '—' : users[i].firstname,
                lastname: users[i].lastname === '' || users[i].lastname === null ? '—' : users[i].lastname,
                email: users[i].email === '' || users[i].email === null ? '—' : users[i].email
            });
        }

        const sortedUsers = SortUserList(fixedUsers, sortMode);

        for (let i = 0; i < sortedUsers.length; i++) {
            if (search !== '' && !sortedUsers[i].username.toLowerCase().includes(search.toLowerCase()) &&
                !sortedUsers[i].firstname.toLowerCase().includes(search.toLowerCase()) &&
                !sortedUsers[i].lastname.toLowerCase().includes(search.toLowerCase())) {
                continue;
            }
            res.push(
                <div key={sortedUsers[i].username}>
                    <Space size="20px" />
                    <UserRecord
                        OnEditClick={() => navigation(`/admin/users/${sortedUsers[i].username}`)}
                        OnDeleteClick={() => DeleteUserRequest(sortedUsers[i].username)}
                        canEdit={selfPermission?.user?.update}
                        canDelete={selfPermission?.user?.remove}
                        username={sortedUsers[i].username}
                        firstname={sortedUsers[i].firstname}
                        lastname={sortedUsers[i].lastname}
                        email={sortedUsers[i].email} />
                </div>
            );
        }

        return res;
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateUsers();
    }, []);

    return (
        <div>
            <ModalWindow visible={isModWinVisible}>
                <DeletePanel
                    header="Type 'yes' to confirm that you want to delete the user."
                    idForDel={usernameForDelete}
                    onDeleteClick={DeleteUser}
                    onCancelClick={() => setModWinVisibility(false)} />
            </ModalWindow>
            <CustomHeader text="User list" textColor="#0036a3" textSize="45px" isCenter={true} />
            <ItemsContainer width="96%">
                <InputBox width="100%" value={search} onChange={(e) => setSearch(e.value)} placeholder="Search" />
                {(selfPermission?.user?.create ?
                    <div style={{ display: 'flex' }}>
                        <Space isHorizontal={true} size="12px" />
                        <InputBox type="button" value="Add User" onClick={() => navToAddUser()} />
                    </div>
                    : "")}
            </ItemsContainer>
            <Space size="30px" />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '96%' }}>
                    <TableHeader
                        components={[
                            { text: 'username', val: 'username' },
                            { text: 'first name', val: 'firstname' },
                            { text: 'last name', val: 'lastname' },
                            { text: 'email', val: 'email' },
                            { text: 'actions', val: null }]}
                        gridMarkUpCols='1fr 1fr 1fr 1fr 1fr'
                        sortInfo={sortMode}
                        onChange={(param, direction) => setSortMode({ parameter: param ?? '', dir: direction ?? '' })} />
                    {RenderUserList()}
                </div>
            </div>
        </div>
    );
}

export default UserListPage;
