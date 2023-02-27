import React from "react";
import style from "./.module.css";

const InputBox = ({ title, name, value, onChange, onClick, onError, type = "text", placeholder = "", className = "", checked = undefined, disabled = false, required = false, error = false }) => {
    const [_error, setError] = React.useState(false);
    const inputRef = React.useRef(null);
    function change() {
        if (onChange) {
            onChange(inputRef.current);
        }
        if (required === true && (value === "" || value === undefined || value === null)) {
            if (onError) {
                onError(true);
            }
            setError(true);
        } else {
            if (onError) {
                onError(false);
            }
            setError(false);
        }
    }
    let inputStile = `${style.input} ${className}${!error ? (_error ? ` ${style.error}` : "") : ` ${style.error}`}`;
    return (
        <div onClick={(e) => {
            if(disabled !== true && onClick)
                onClick(e);
        }} className={style.box}>
            <span className={style.title}>{title}</span>
            <input checked={checked ?? ""}
                type={type}
                name={name}
                defaultValue={value}
                onChange={change} onInput={change} onKeyUp={change} onPaste={change} onCut={change}
                placeholder={placeholder}
                className={inputStile}
                disabled={disabled}
                ref={inputRef} />
        </div>
    );
}

export default InputBox;