import React from "react";
import style from "./.module.css";

const SaveOrCancelForm = ({ onSave, onCancel, disabledSave = false }) => {
    let saveButtonClass = disabledSave !== true ? style.save : style.saveDisabled;
    return (
        <div className={style.container}>
            <button className={style.cancel} onClick={onCancel}>Cancel</button>
            <button className={saveButtonClass} onClick={onSave}>Save</button>
        </div>
    );
};

export default SaveOrCancelForm;