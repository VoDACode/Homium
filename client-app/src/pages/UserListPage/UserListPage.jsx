import React from "react";
import { useNavigate } from 'react-router-dom';
import { ApiUsers } from "../../services/api/users";
import cl from "./.module.css";
import ItemsContainer from "../../components/ItemsContainer/ItemsContainer";
import InputBox from "../../components/InputBox/InputBox";
import TableHeader from "../../components/TableHeader/TableHeader";
import Space from "../../components/Space/Space";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

const UserListPage = () => {

    const [isListLoaded, setIsListLoaded] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [isModWinVisible, setModWinVisibility] = React.useState(false);
    const [usernameForDelete, setDeletingUsername] = React.useState(null);
    const [search, setSearch] = React.useState('');
    const [selfPermission, setSelfPermission] = React.useState({});
    const [sortMode, setSortMode] = React.useState({ parameter: '', dir: '' });

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

        setModWinVisibility(false);
        setIsListLoaded(false);

        ApiUsers.deleteUser(username).then(response => {
            if (response.status === 200) {
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
                    <Space height="20px" />
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
                    <Space height="20px" />
                    <div className={cl.user_record}>
                        <div className={cl.content_un}>
                            <p className={cl.username}>{sortedUsers[i].username}</p>
                        </div>
                        <div className={cl.user_info_sep_line}>
                            <div></div>
                        </div>
                        <div className={cl.content_fn}>
                            <p className={cl.first_name}>{sortedUsers[i].firstname}</p>
                        </div>
                        <div className={cl.user_info_sep_line}>
                            <div></div>
                        </div>
                        <div className={cl.content_ln}>
                            <p className={cl.last_name}>{sortedUsers[i].lastname}</p>
                        </div>
                        <div className={cl.user_info_sep_line}>
                            <div></div>
                        </div>
                        <div className={cl.content_e}>
                            <p className={cl.email}>{sortedUsers[i].email}</p>
                        </div>
                        <div className={cl.user_info_sep_line}>
                            <div></div>
                        </div>
                        <div className={cl.buttons}>
                            <div>
                                <div type="edit" onClick={() => navigation(`/admin/users/${sortedUsers[i].username}`)} className={cl.base_button}>
                                    <p>{selfPermission?.user?.update ? "Edit" : "Info"}</p>
                                </div>
                                {(
                                    selfPermission?.user?.remove ?
                                        <div className={cl.base_button} type="delete" onClick={() => DeleteUserRequest(sortedUsers[i].username)}>
                                            <p>Delete</p>
                                        </div>
                                        : <></>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return res;
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateUsers();
    }, []);

    return (
        <div>
            <ModalWindow visible={isModWinVisible}>
                <div className={cl.delete_panel}>
                    <p className={cl.delete_panel_header}>Type 'yes' to confirm that you want to delete the user.</p>
                    <Space height="30px" />
                    <input className={cl.delete_panel_input} placeholder="write here" />
                    <Space height="30px" />
                    <div className={cl.delete_panel_buttons}>
                        <button className={cl.delete_panel_delete_button}
                            onClick={() => {
                                if (document.getElementsByClassName(cl.delete_panel_input)[0].value === 'yes') {
                                    DeleteUser(usernameForDelete);
                                }
                                else {
                                    alert("The input does not equal 'yes'!");
                                }
                            }}>Delete</button>
                        <button className={cl.delete_panel_cancel_button} onClick={() => setModWinVisibility(false)}>Cancel</button>
                    </div>
                </div>
            </ModalWindow>
            <h1 className={cl.page_header}>User list</h1>
            <ItemsContainer width="96%">
                <InputBox width="340px" value={search} onChange={(e) => setSearch(e.value)} placeholder="Search" />
                {(selfPermission?.user?.create ?
                    <div style={{ display: 'flex' }}>
                        <Space width="120px" />
                        <InputBox width="100px" type="button" value="Add User" onClick={() => navToAddUser()} />
                    </div>
                    : "")}
            </ItemsContainer>
            <Space height="30px" />
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
