import React from "react";
import cl from './.module.css';

const UserRecord = ({ username, firstname, lastname, email, OnDeleteClick, OnEditClick, canEdit, canDelete }) => {

    const user = { username, firstname, lastname, email };

    return (
        <div className={cl.box}>
            <div className={cl.content_un}>
                <p className={cl.username}>{user.username ?? ""}</p>
            </div>
            <div className={cl.content_fn}>
                <p className={cl.first_name}>{user.firstname ?? ""}</p>
            </div>
            <div className={cl.content_ln}>
                <p className={cl.last_name}>{user.lastname ?? ""}</p>
            </div>
            <div className={cl.content_e}>
                <p className={cl.email}>{user.email ?? ""}</p>
            </div>
            <div className={cl.buttons}>
                <div>
                    <button type="edit" onClick={() => OnEditClick()} className={cl.baseButton}>{canEdit ? "Edit" : "Info"}</button>
                    {(canDelete ? <button type="delete" onClick={() => OnDeleteClick()} className={cl.baseButton}>Delete</button> : "")}
                </div>
            </div>
        </div>
    );
}

export default UserRecord;
