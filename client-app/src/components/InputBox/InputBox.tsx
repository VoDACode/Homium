import React from "react";
import style from "./.module.css";

interface Props {
    title?: string,
    name?: string,
    value?: string,
    onChange?: any,
    onClick?: any,
    onError?: any,
    type?: string,
    placeholder?: string,
    width?: string,
    className?: string,
    isHeaderLeft?: boolean,
    checked?: boolean,
    disabled?: boolean,
    required?: boolean,
    error?: boolean
}

const InputBox = ({ title = '', name, value, onChange, onClick, onError, type = "text", placeholder = "", width = '100px', className = "", isHeaderLeft = false, checked = false, disabled = false, required = false, error = false }: Props) => {

    const [_error, setError] = React.useState<boolean>(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    let inputStile = `${style.input} ${className}${!error ? (_error ? ` ${style.error}` : "") : ` ${style.error}`}`;

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

    return (
        <div onClick={(e) => {
            if (disabled !== true && onClick)
                onClick(e);
        }} className={style.box}>
            <span className={style.title}>{title}</span>
            <br style={{ display: isHeaderLeft || title === '' ? 'none' : 'block' }} />
            <input checked={checked ?? ""}
                style={{
                    width: width
                }}
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