import React, { useEffect, useRef, useState } from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const CustomSelect = ({ enabled = true, isDefaultOptionAllowed = false, space = '0px', headerText = '', headerSize = '15px', headerWeight = 'normal', options = [], optionWeight = 'normal', optionSize = '15px', chosenValue = '-', onChange, type = 'classic', paddingLeft = '1em', paddingRight = '3.5em', paddingTop = '0.4em', paddingBottom = '0.4em', width = 'fit-content' }) => {

    const [menuStyle, setMenuStyle] = useState('');

    const selectRef = useRef();

    function ChangeValue(e) {
        onChange(e);
        selectRef.current.value = e.target.value;
    }

    function RenderOptions() {
        var res = [];
        var fixedOptions = [...options];
        var i = 1;
        var chosenElement = { name: '', val: '' };

        for (let j = 0; j < fixedOptions.length; j++) {
            if (fixedOptions[j].val === chosenValue) {
                chosenElement.name = fixedOptions[j].name;
                chosenElement.val = fixedOptions[j].val;
                break;
            }
        }

        fixedOptions = fixedOptions.filter(el => {
            return el.val !== chosenValue;
        });

        fixedOptions.unshift(chosenElement);

        fixedOptions.map((el) => {
            res.push(<option value={el.val} key={i} style={{ fontSize: optionSize, fontWeight: optionWeight }}>{el.name}</option>);
            i++;
            return true;
        });
        
        if (isDefaultOptionAllowed) res.push(<option key={i} value=""></option>);

        return res;
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

        selectRef.current.value = chosenValue;
    }, [type, chosenValue]);

    return (
        <div className={cl.main}>
            <p className={cl.header} style={{ fontSize: headerSize, fontWeight: headerWeight }}>{headerText}</p>
            <Space size={space} />
            <select className={menuStyle} disabled={!enabled} ref={selectRef} onChange={(e) => ChangeValue(e)}
                style={{ paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: paddingTop, paddingBottom: paddingBottom, fontSize: optionSize, fontWeight: optionWeight, width: width }}>
                {RenderOptions()}
            </select>
        </div>
    );
}

export default CustomSelect;