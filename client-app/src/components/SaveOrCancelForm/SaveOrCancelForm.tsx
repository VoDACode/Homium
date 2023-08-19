import style from "./.module.css";

interface Props {
    onSave?: any,
    onCancel?: any,
    disabledSave?: boolean,
    includeCancelButton?: boolean,
    flexEndOn?: boolean
}

const SaveOrCancelForm = ({ onSave, onCancel, disabledSave = false, includeCancelButton = true, flexEndOn = true }: Props) => {

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