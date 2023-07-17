import React, { useState } from "react";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import Space from "../Space/Space";
import cl from './.module.css';

const YesNoPanel = ({ yesPressed, noPressed, onCheckboxCheck, checkboxName, checkboxValue, checkboxText = '', includeCheckbox = false, header = '' }) => {

    const [checkVal, setCheckVal] = useState(checkboxValue);

    function YesClick() {
        onCheckboxCheck(checkboxName, checkVal);
        yesPressed();
    }

    function NoClick() {
        onCheckboxCheck(checkboxName, checkVal);
        noPressed();
    }

    function RenderCheckbox() {
        if (includeCheckbox)
            return <CustomCheckbox 
                name={checkboxName}
                textPosition="right" 
                text={checkboxText}
                textSize="20px" 
                scale="1.4" 
                checked={checkVal} 
                onChange={(name, value) => setCheckVal(value)} />;
        else 
            return null;
    }

    return (
        <div>
            <p className={cl.header}>{header}</p>
            <Space height="30px" />
            {RenderCheckbox()}
            <Space height="30px" />
            <div className={cl.buttons}>
                <button className={cl.yes} onClick={() => YesClick()}>Yes</button>
                <button className={cl.no} onClick={() => NoClick()}>No</button>
            </div>
        </div>
    );
}

export default YesNoPanel;