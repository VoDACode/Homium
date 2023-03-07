import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import ObjectSection from "../components/ObjectSection/ObjectSection";
import { ApiObjects } from "../services/api/objects";

const ObjectListPage = () => {

    const [objectList, setObjectList] = useState([]);

    function UpdateObjects() {
        ApiObjects.getRootObjectIds().then(async ids => {
            var objects = [];
            for (let i = 0; i < ids.length; i++) {
                objects.push(await ApiObjects.getObject(ids[i], true));
            }
            setObjectList(objects);
        });
    }

    function RenderObjects() {
        var rendered = [];
        for (let i = 0; i < objectList.length; i++) {
            rendered.push(
                <ObjectSection 
                    id={objectList[i].id} 
                    key={objectList[i].id} 
                    name={objectList[i].name} 
                    forcedChildCount={objectList[i].children.length}
                    forcedPropCount={Object.keys(objectList[i].properties).length} />);
        }
        return rendered;
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateObjects();
    }, []);

    return (
        <div>
            <CustomHeader text="Object list" textColor="#0036a3" textSize="45px" isCenter={true} />
            <ul className="object_list">
                {RenderObjects()}
                <li
                    style={{
                        color: 'rgb(234, 132, 0)',
                        padding: '0.5vh',
                        borderRadius: '1vh',
                        textDecoration: 'underline solid rgb(255, 64, 0)'
                    }}
                    onMouseEnter={e => { e.target.style.backgroundColor = 'cyan' }}
                    onMouseLeave={e => { e.target.style.backgroundColor = '' }}>Add new object</li>
            </ul>
        </div>
    );
}

export default ObjectListPage;