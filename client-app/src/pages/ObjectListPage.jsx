import React, { useEffect } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import ObjectSection from "../components/ObjectSection/ObjectSection";

const ObjectListPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = '#adf5ff';
    }, []);

    return (
        <div>
            <CustomHeader text="Object list" textColor="#3e5c58" textSize="5vh" isCenter={true}/>
            <ul className="object_list">
                <ObjectSection name="Object 1" 
                    properties={[{id: 1, val: 'on'}, {id: 2, val: 'off'}]} 
                    children={[{id: 1, val: 'lamp'}, {id: 2, val: 'flashlight'}, {id: 3, val: 'night light'}, {id: 4, val: 'special light'}, {id: 5, val: 'chandelier'}]}/>
                <ObjectSection name="Object 2" 
                    properties={[{id: 1, val: 'on'}, {id: 2, val: 'off'}]} 
                    children={[{id: 1, val: 'lamp'}, {id: 2, val: 'flashlight'}, {id: 3, val: 'night light'}]}/>
                <ObjectSection name="Object 3" 
                    properties={[{id: 1, val: 'on'}, {id: 2, val: 'off'}]} 
                    children={[{id: 1, val: 'lamp'}, {id: 2, val: 'flashlight'}, {id: 3, val: 'night light'}, {id: 4, val: 'special light'}]}/>
                <li 
                    style={{
                        color: 'rgb(234, 132, 0)', 
                        padding: '0.5vh', 
                        borderRadius: '1vh', 
                        textDecoration: 'underline solid rgb(255, 64, 0)'}}
                        onMouseEnter={e => {e.target.style.backgroundColor = 'cyan'}}
                        onMouseLeave={e => {e.target.style.backgroundColor = ''}}>Add new object</li>
            </ul>
        </div>
    );
}

export default ObjectListPage;