import React, { useRef } from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const DeletePanel = ({ header, idForDel, onDeleteClick, onCancelClick }) => {

    const inputRef = useRef();

    function DeleteEvent() {
        if (inputRef.current.value === 'yes') {
            onDeleteClick(idForDel);
        }
        else {
            alert('Invalid input');
        }
    }

    return (
        <div className={cl.main}>
            <p className={cl.header}>{header}</p>
            <Space height="30px" />
            <input className={cl.in} placeholder="write here" ref={inputRef} />
            <Space height="30px" />
            <div className={cl.buttons}>
                <button className={cl.delete} onClick={() => DeleteEvent()}>Delete</button>
                <button className={cl.cancel} onClick={() => onCancelClick()}>Cancel</button>
            </div>
        </div>
    );
}

export default DeletePanel;