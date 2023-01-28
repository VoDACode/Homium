import React from "react";
import { Link } from "react-router-dom";
import VertSpace from "../VertSpace/VertSpace";
import cl from './.module.css';

const AccountOffer = ({headerText, linkText}) => {
    return (
        <div className={cl.main}>
            <p className={cl.header}>{headerText}</p>
            <VertSpace h={2} unit="vh"/>
            <Link className={cl.link} to="/reg">{linkText}</Link>
        </div>
    );
}

export default AccountOffer;