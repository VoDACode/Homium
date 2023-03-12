import React, { useState } from 'react';
import { ApiObjects } from '../../services/api/objects';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import Space from '../Space/Space';
import cl from './.module.css';

const ObjectSection = ({ id = undefined, name = '...', forcedChildCount = 0, forcedPropCount = 0, path = [] }) => {

    const [loadingProcess, setLoadingProcess] = useState({ childList: false, propertyList: false });
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
                    props.push({ key: key, value: value });
                }
                setPropertyList(props);
                setPropsLoading(true);
                setLoadingProcess(prev => {
                    var newState = { ...prev };
                    newState.propertyList = true;
                    return newState;
                });
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
                setLoadingProcess(prev => {
                    var newState = { ...prev };
                    newState.childList = true;
                    return newState;
                });
            });
        }
        setChildrenState(!isChildrenOpened)
    }

    function RenderProperties() {
        if (!loadingProcess.propertyList)
            return (
                <div>
                    <Space size="10px" />
                    <LoadingAnimation size="50px" loadingCurveWidth="11px" />
                </div>
            );

        var rendered = [];
        for (let i = 0; i < propertyList.length; i++) {
            rendered.push(<li className={cl.el} key={propertyList[i].key}>{propertyList[i].key}: {propertyList[i].value.toString()}</li>);
        }
        return rendered;
    }

    function RenderChildren() {
        if (!loadingProcess.childList)
            return (
                <div>
                    <Space size="10px" />
                    <LoadingAnimation size="50px" loadingCurveWidth="11px" />
                </div>
            );

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

    function RenderPath() {
        if (path.length > 1) {
            var rendered = [];
            for (let i = 0; i < path.length - 1; i++) {
                if (i !== 0) {
                    rendered.push(<span className={cl.arrow} key={path[i].id + '-arrow'}>{'>>'}</span>);
                }
                rendered.push(<span className={cl.path} key={path[i].id}>{path[i].name}</span>);
            }
            return rendered;
        }
        else {
            return null;
        }
    }

    return (
        <li className={cl.main}>
            <div className={cl.path_cont}>{RenderPath()}</div>
            <span className={cl.header} onClick={() => setObjectState(!isObjectOpened)}>{isObjectOpened ? '▾' : '▸'}{name}</span>
            <ul style={{ display: isObjectOpened ? 'block' : 'none' }}>
                <li className={cl.properties}>
                    <span className={cl.header} onClick={() => UpdateProperties()}>{isPropsOpened ? '▾' : '▸'}Properties</span>
                    <span className={cl.count}> ({forcedPropCount && propertyList.length === 0 ? forcedPropCount : propertyList.length})</span>
                    <ul style={{ display: isPropsOpened ? 'block' : 'none' }}>
                        {RenderProperties()}
                        <li className={cl.adder}><span>Add new property</span></li>
                    </ul>
                </li>
                <li className={cl.children}>
                    <span className={cl.header} onClick={() => UpdateChildren()}>{isChildrenOpened ? '▾' : '▸'}Children</span>
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