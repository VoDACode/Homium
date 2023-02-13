import React from "react";
import { Link } from "react-router-dom";
import Space from "../Space/Space";
import cl from './.module.css';

const AccountOffer = ({headerText, linkText, linkTo, headerColor}) => {
    return (
        <div className={cl.main}>
            <p className={cl.header} style={{color: headerColor || '#000000'}}>{headerText || '...'}</p>
            <Space size="2vh"/>
            <Link className={cl.link} to={linkTo || '/'}>{linkText || '...'}</Link>
        </div>
    );
}

export default AccountOffer;