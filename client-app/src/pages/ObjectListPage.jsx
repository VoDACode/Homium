import React from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import ObjectSection from "../components/ObjectSection/ObjectSection";

const ObjectListPage = () => {
    return (
        <div>
            <CustomHeader text="Object list" textColor="#2b9aad" textSize="5vh" isCenter={true}/>
            <ul className="object_list">
                <ObjectSection name="Object 1"/>
                <ObjectSection name="Object 2"/>
                <ObjectSection name="Object 3"/>
                <li>Add new object</li>
            </ul>
        </div>
    );
}

export default ObjectListPage;