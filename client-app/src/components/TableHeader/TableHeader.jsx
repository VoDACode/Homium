import React from "react";
import cl from './.module.css';

const TableHeader = ({components = [], gridMarkUpCols = null}) => {

    function RenderComponents() {
        var res = [];
        var i = 1;
        components.map(el => {
            res.push(<div key={i}><p className={cl.attribute}>{el}</p></div>);
            i++;
            return true;
        })
        return res;
    }

    return (
        <div className={cl.main} style={{gridTemplateColumns: gridMarkUpCols}}>
            {RenderComponents()}
        </div>
    );
}

export default TableHeader;