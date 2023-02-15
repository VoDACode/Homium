import React from "react";
import cl from './.module.css';

const CustomSelect = ({options, chosenValue, onValueChanged}) => {

    function RenderOptions() {
        if (options === undefined || options === null || options.length === 0) {
            return (<option key={1}>-</option>);
        } else {
            var res = [];
            var i = 1;
            options.map((el) => {
                res.push(<option value={el.val} key={i}>{el.name}</option>);
                i++;
                return true;
            });
            return res;
        }
    }

    return (
        <select className={cl.menu} value={chosenValue} onChange={(e) => {if (onValueChanged) {onValueChanged(e.target.value)}}}>
            {RenderOptions()}
        </select>
    );
}

export default CustomSelect;