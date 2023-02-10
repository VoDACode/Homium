import React, { useEffect, useState } from "react";
import UserRecord from "../components/UserRecord/UserRecord";

const UserAdministrationPage = () => {
    const [users, setData] = useState([]);
    let items = [];
    useEffect(() => {
        updateUsers();
    }, []);
    const updateUsers = () => {
        fetch('/api/users/list')
            .then(response => response.json())
            .then(data => {
                setData(data);
            }).catch(error => {
                console.log(error);
            });
    }
    for (let i = 0; i < users.length; i++) {
        items.push(<UserRecord key={i} username={users[i].username} firstname={users[i].firstname} lastname={users[i].lastname} onUpdate={updateUsers} />);
    }
    return (
        <div>
            {items}
        </div>
    );
}

export default UserAdministrationPage;