import React from "react";
import cl from './.module.css';

const ScriptRecord = ({nameAttr, descriptionAttr, OnExecClick, OnEditClick, OnDeleteClick}) => {
    return (
        <div className={cl.box}>
            <div className={cl.cont}>
                <p className={cl.name}>{nameAttr ?? ""}</p>
            </div>
            <div className={cl.cont}>
                <p className={cl.description} title={descriptionAttr === "—" ? "" : descriptionAttr}>{descriptionAttr ?? "—"}</p>
            </div>
            <div className={cl.buttons}>
                <div>
                    <button className={cl.baseButton} type="exec" onClick={() => OnExecClick()}>Exec</button>
                    <button className={cl.baseButton} type="edit" onClick={() => OnEditClick()}>Edit</button>
                    <button className={cl.baseButton} type="delete" onClick={() => OnDeleteClick()}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default ScriptRecord;