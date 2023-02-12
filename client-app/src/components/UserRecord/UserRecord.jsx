import React from "react";
import cl from './.module.css';
import { useNavigate } from 'react-router-dom';
import { ApiUsers } from "../../services/api/users";

const UserRecord = ({ username, firstname, lastname, onUpdate, canEdit, canDelete }) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState({ username, firstname, lastname });

    const editUser = () => {
        navigate(`${user.username}`);
    }

    const deleteUser = () => {
        let data = prompt("Are you sure you want to delete this user? Type 'yes' to confirm.");
        if (data === "yes") {
            ApiUsers.deleteUser(user.username).then(async response => {
                if (response.status === 200) {
                    onUpdate();
                } else {
                    alert(await response.text());
                }
            });
        }
    }

    return (
        <div className={cl.box}>
            <div>
                <span className={cl.item_text}>{user.username}</span>
            </div>
            <div>
                <span className={cl.item_text}>{user.firstname ?? ""} {user.lastname ?? ""}</span>
            </div>
            <div>
                <button type="edit" onClick={editUser} className={cl.baseButton}>{canEdit ? "Edit" : "Info"}</button>
                {(canDelete ? <button type="delete" onClick={deleteUser} className={cl.baseButton}>Delete</button> : "")}
            </div>
        </div>
    );
}

export default UserRecord;