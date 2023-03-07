import React, { useState } from 'react';
import { ApiObjects } from '../../services/api/objects';
import cl from './.module.css';

const ObjectSection = ({ id = undefined, name = '...', forcedChildCount = 0, forcedPropCount = 0 }) => {

    const [childList, setChildList] = useState([]);
    const [propertyList, setPropertyList] = useState([]);
    const [isObjectOpened, setObjectState] = useState(false);
    const [isPropsOpened, setPropsState] = useState(false);
    const [isPropsLoaded, setPropsLoading] = useState(false);
    const [isChildrenOpened, setChildrenState] = useState(false);
    const [isChildrenLoaded, setChildrenLoading] = useState(false);

    function UpdateProperties() {
        if (!isPropsLoaded) {
            ApiObjects.getLogicalObject(id).then(async propObj => {
                var props = [];
                for (const [key, value] of Object.entries(propObj)) {
                    props.push({key: key, value: value});
                }
                setPropertyList(props);
                setPropsLoading(true);
            });
        }
        setPropsState(!isPropsOpened);
    }

    function UpdateChildren() {
        if (!isChildrenLoaded) {
            ApiObjects.getChildrenIds(id).then(async IDs => {
                var children = [];
                for (let i = 0; i < IDs.length; i++) {
                    children.push(await ApiObjects.getObject(IDs[i], true));
                }
                setChildList(children);
                setChildrenLoading(true);
            });
        }
        setChildrenState(!isChildrenOpened)
    }

    function RenderProperties() {
        var rendered = [];
        for (let i = 0; i < propertyList.length; i++) {
            rendered.push(<li className={cl.el} key={propertyList[i].key}>{propertyList[i].key}: {propertyList[i].value.toString()}</li>);
        }
        return rendered;
    }

    function RenderChildren() {
        var rendered = [];
        for (let i = 0; i < childList.length; i++) {
            rendered.push(
                <ObjectSection 
                    id={childList[i].id} 
                    key={childList[i].id} 
                    name={childList[i].name}
                    forcedChildCount={childList[i].children.length}
                    forcedPropCount={Object.keys(childList[i].properties).length} />);
        }
        return rendered;
    }

    return (
        <li className={cl.main}>
            <span className={cl.header} onClick={() => setObjectState(!isObjectOpened)}>{isObjectOpened ? '-' : '+'} {name}</span>
            <ul style={{ display: isObjectOpened ? 'block' : 'none' }}>
                <li className={cl.properties}>
                    <span className={cl.header} onClick={() => UpdateProperties()}>{isPropsOpened ? '-' : '+'} Properties</span>
                    <span className={cl.count}> ({forcedPropCount && propertyList.length === 0 ? forcedPropCount : propertyList.length})</span>
                    <ul style={{ display: isPropsOpened ? 'block' : 'none' }}>
                        {RenderProperties()}
                        <li className={cl.adder}><span>Add new property</span></li>
                    </ul>
                </li>
                <li className={cl.children}>
                    <span className={cl.header} onClick={() => UpdateChildren()}>{isChildrenOpened ? '-' : '+'} Children</span>
                    <span className={cl.count}> ({forcedChildCount && childList.length === 0 ? forcedChildCount : childList.length})</span>
                    <ul style={{ display: isChildrenOpened ? 'block' : 'none' }}>
                        {RenderChildren()}
                        <li className={cl.adder}><span>Add new child</span></li>
                    </ul>
                </li>
            </ul>
        </li>
    );
}

export default ObjectSection;