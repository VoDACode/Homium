import React from "react";
import style from "./.module.css";

interface Props {
    children?: React.ReactNode,
    title?: string,
    className?: string,
    horizontal?: string,
    vertical?: string,
    margin?: any,
    width?: string,
    inlineFlexMode?: boolean
}

const ItemsContainer = ({ children, title = "", className = "", horizontal = "center", vertical = "top", margin = {}, width = 'auto', inlineFlexMode = false }: Props) => {
    margin = {
        top: margin.top ?? 0,
        right: margin.right ?? 0,
        bottom: margin.bottom ?? 0,
        left: margin.left ?? 0
    };
    width = width ?? 'auto';
    let classes = "";
    switch (horizontal) {
        case "left":
            classes += ` ${style.left}`;
            break;
        case "center":
            classes += ` ${style.center}`;
            break;
        case "right":
            classes += ` ${style.right}`;
            break;
        default:
            break;
    }

    switch (vertical) {
        case "top":
            classes += ` ${style.top}`;
            break;
        case "center":
            classes += ` ${style.middle}`;
            break;
        case "bottom":
            classes += ` ${style.bottom}`;
            break;
        default:
            break;
    }
    return (
        <div className={`${style.container} ${className} ${classes}`} style={{
            marginTop: margin.top,
            marginRight: margin.right,
            marginBottom: margin.bottom,
            marginLeft: margin.left,
            width: width
        }}>
            {(title && <span className={style.title}>{title}</span>)}
            <div className={style.items} style={{display: inlineFlexMode ? 'inline-flex' : 'block'}}>
                {children}
            </div>
        </div>
    );
}

export default ItemsContainer;