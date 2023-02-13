import React from "react";
import cl from './.module.css';

const CustomSelect = ({options}) => {

    function RenderOptions() {
        if (options === undefined || options === null || options.length === 0) {
            return (<option key={1}>-</option>);
        } else {
            var res = [];
            var i = 1;
            options.map((el) => {
                res.push(<option key={i}>{el}</option>);
                i++;
            });
            return res;
        }
    }

    return (
        <select className={cl.menu}>
            {RenderOptions()}
        </select>
    );
}

export default CustomSelect;