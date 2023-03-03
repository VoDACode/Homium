import React from "react";
import style from "./.module.css";

const SaveOrCancelForm = ({ onSave, onCancel, disabledSave = false, includeCancelButton = true, flexEndOn = true }) => {

    let saveButtonClass = disabledSave !== true ? style.save : style.saveDisabled;

    function RenderCancelButton() {
        if (includeCancelButton)
            return <button className={style.cancel} onClick={onCancel}>Cancel</button>;
        else
            return null;
    }

    return (
        <div className={style.container} style={{justifyContent: flexEndOn ? 'flex-end' : 'flex-start'}}>
            {RenderCancelButton()}
            <button className={saveButtonClass} onClick={onSave}>Save</button>
        </div>
    );
};

export default SaveOrCancelForm;