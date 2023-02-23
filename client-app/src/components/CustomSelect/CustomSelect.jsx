import React, { useEffect, useState } from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const CustomSelect = ({ space = '0px', headerText = '', headerSize = '15px', headerWeight = 'normal', options = [], optionWeight = 'normal', optionSize = '15px', chosenValue = null, onValueChanged, type = 'classic', paddingLeft = '1em', paddingRight = '3.5em', paddingTop = '0.4em', paddingBottom = '0.4em' }) => {

    const [menuStyle, setMenuStyle] = useState('');

    function RenderOptions() {
        if (options === undefined || options === null || options.length === 0) {
            return (<option key={1}>-</option>);
        } else {
            var res = [];
            var i = 1;
            options.map((el) => {
                res.push(<option value={el.val} key={i} style={{ fontSize: optionSize, fontWeight: optionWeight }}>{el.name}</option>);
                i++;
                return true;
            });
            return res;
        }
    }

    useEffect(() => {
        if (type === 'classic') {
            setMenuStyle(`${cl.menu} ${cl.menu_classic}`);
        }
        else if (type === 'round') {
            setMenuStyle(`${cl.menu} ${cl.menu_round}`);
        }
        else if (type === 'simple') {
            setMenuStyle(`${cl.menu} ${cl.menu_simple}`);
        }
    }, [menuStyle]);

    return (
        <div className={cl.main}>
            <p className={cl.header} style={{fontSize: headerSize, fontWeight: headerWeight}}>{headerText}</p>
            <Space size={space} />
            <select className={menuStyle} value={chosenValue} onChange={(e) => { if (onValueChanged) { onValueChanged(e.target.value) } }}
                style={{ paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: paddingTop, paddingBottom: paddingBottom, fontSize: optionSize, fontWeight: optionWeight }}>
                {RenderOptions()}
            </select>
        </div>
    );
}

export default CustomSelect;