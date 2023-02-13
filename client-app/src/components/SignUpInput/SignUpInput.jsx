import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const SignUpInput = () => {
    var space = (<Space size="2vh"/>);

    return (
        <div>
            <input className={cl.first_name} type="text" placeholder="First name"/>
            {space}
            <input className={cl.last_name} type="text" placeholder="Last name"/>
            {space}
            <input className={cl.username} type="text" placeholder="Username *"/>
            {space}
            <input className={cl.password} type="password" placeholder="Password *"/>
            {space}
            <input className={cl.confirm_password} type="password" placeholder="Confirm the password *"/>
        </div>
    );
}

export default SignUpInput;