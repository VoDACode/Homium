import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiObjects } from '../../services/api/objects';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import Space from '../Space/Space';
import cl from './.module.css';

type PropertyShortInfo = {
    key: string,
    value: any
}

type PropertyFullInfo = {
    key: string,
    value: any,
    canHaveHistory: boolean,
    historyLimit: number,
    mqttProperty: {
        display: boolean,
        subscribe: boolean
    },
    history: Array<any>
}

type ObjectShortInfo = {
    id: string,
    name: string
}

type ObjectFullInfo = {
    id: string,
    name: string,
    children: Array<string>,
    properties: Array<PropertyFullInfo>,
    description: string | null,
    parentId: string | null,
    allowAnonymous: boolean
}

interface Props {
    id?: string,
    name?: string,
    forcedChildCount?: number,
    forcedPropCount?: number,
    path?: Array<ObjectShortInfo>,
    sortByAsc?: boolean,
    modalWindowControl?: any,
    onAddChildClick?: any,
    onAddPropertyClick?: any,
    onEditClick?: any,
    onRemoveClick?: any
}

const ObjectSection = ({ id = undefined, name = '...', forcedChildCount = 0, forcedPropCount = 0, path = [], sortByAsc = true, modalWindowControl, onAddPropertyClick, onAddChildClick, onEditClick, onRemoveClick }: Props) => {

    const navigate = useNavigate();
    const navToEditObject = (id: string, parentId?: string | null, addProp: string = '') => {
        var parent = `?parent=${parentId ?? ''}`;
        var newProp = `&prop=${addProp}`;
        navigate(`/admin/objects/${id}${parent}${newProp}`);
    }

    const [loadingProcess, setLoadingProcess] = React.useState({ childList: false, propertyList: false });
    const [childList, setChildList] = React.useState<Array<ObjectFullInfo>>([]);
    const [propertyList, setPropertyList] = React.useState<Array<PropertyShortInfo>>([]);
    const [isObjectOpened, setObjectState] = React.useState(false);
    const [isPropsOpened, setPropsState] = React.useState(false);
    const [isPropsLoaded, setPropsLoading] = React.useState(false);
    const [isChildrenOpened, setChildrenState] = React.useState(false);
    const [isChildrenLoaded, setChildrenLoading] = React.useState(false);

    function SortChildren(list: Array<ObjectFullInfo>, asc = true) {
        var instance = [...list];

        instance.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return asc ? -1 : 1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return asc ? 1 : -1;
            }
            return 0;
        });

        return instance;
    }

    function SortProperties(list: Array<PropertyShortInfo>, asc = true) {
        var instance = [...list];

        instance.sort((a, b) => {
            if (a.key.toLowerCase() < b.key.toLowerCase()) {
                return asc ? -1 : 1;
            }
            if (a.key.toLowerCase() > b.key.toLowerCase()) {
                return asc ? 1 : -1;
            }
            return 0;
        });

        return instance;
    }

    function UpdateProperties() {
        if (!isPropsLoaded) {
            ApiObjects.getLogicalObject(id ?? "").then(async propObj => {
                var props: Array<PropertyShortInfo> = [];
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
            ApiObjects.getChildrenIds(id ?? "").then(async IDs => {
                var children: Array<ObjectFullInfo> = [];
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
                    <Space height="10px" />
                    <LoadingAnimation size="50px" loadingCurveWidth="11px" />
                </div>
            );

        var rendered = [];
        const sortedProps = SortProperties(propertyList, sortByAsc);

        for (let i = 0; i < sortedProps.length; i++) {
            rendered.push(<li className={cl.prop} key={sortedProps[i].key}>{sortedProps[i].key}: {sortedProps[i].value.toString()}</li>);
        }

        rendered.push(<li key={`${id}-add-prop`} className={cl.adder}><span onClick={onAddPropertyClick}>Add new property</span></li>);

        return rendered;
    }

    function RenderChildren() {
        if (!loadingProcess.childList)
            return (
                <div>
                    <Space height="10px" />
                    <LoadingAnimation size="50px" loadingCurveWidth="11px" />
                </div>
            );

        var rendered = [];
        const sortedChildren = SortChildren(childList, sortByAsc);

        for (let i = 0; i < sortedChildren.length; i++) {
            rendered.push(
                <ObjectSection
                    id={sortedChildren[i].id}
                    key={sortedChildren[i].id}
                    name={sortedChildren[i].name}
                    modalWindowControl={modalWindowControl}
                    sortByAsc={sortByAsc}
                    forcedChildCount={sortedChildren[i].children.length}
                    forcedPropCount={Object.keys(sortedChildren[i].properties).length}
                    onAddChildClick={() => navToEditObject('add', sortedChildren[i].id)}
                    onAddPropertyClick={() => navToEditObject(sortedChildren[i].id, sortedChildren[i].parentId, 'add')}
                    onEditClick={() => navToEditObject(sortedChildren[i].id, sortedChildren[i].parentId)}
                    onRemoveClick={() => modalWindowControl(sortedChildren[i].id)} />);
        }

        rendered.push(<li key={`${id}-add-child`} className={cl.adder}><span onClick={onAddChildClick}>Add new child</span></li>);

        return rendered;
    }

    function RenderPath() {
        if (path.length > 1) {
            var rendered = [];

            for (let i = 0; i < path.length - 1; i++) {

                var parentId = i !== 0 ? path[i - 1].id : undefined;

                if (i !== 0) {
                    rendered.push(<span className={cl.arrow} key={path[i].id + '-arrow'}>{'>>'}</span>);
                }

                rendered.push(
                    <span
                        className={cl.path}
                        key={path[i].id}
                        onClick={() => navToEditObject(path[i].id, parentId)}
                    >{path[i].name}</span>);
            }

            return rendered;
        }
        else {
            return null;
        }
    }

    return (
        <li className={cl.main}>
            <div className={cl.obj_body}>
                <div className={cl.path_cont}>{RenderPath()}</div>
                <div className={cl.header_block}>
                    <span className={cl.header} onClick={() => setObjectState(!isObjectOpened)}>{isObjectOpened ? '▾' : '▸'}{name}</span>
                    <div className={cl.option_block}>
                        <img
                            className={cl.remove + " " + cl.option}
                            onClick={() => onRemoveClick()} />
                        <img
                            className={cl.edit + " " + cl.option}
                            onClick={() => onEditClick()} />
                    </div>
                </div>
                <ul style={{ display: isObjectOpened ? 'block' : 'none' }}>
                    <li className={cl.properties}>
                        <span className={cl.header} onClick={() => UpdateProperties()}>{isPropsOpened ? '▾' : '▸'}Properties</span>
                        <span className={cl.count}> ({forcedPropCount && propertyList.length === 0 ? forcedPropCount : propertyList.length})</span>
                        <ul style={{ display: isPropsOpened ? 'block' : 'none' }}>
                            {RenderProperties()}
                        </ul>
                    </li>
                    <li className={cl.children}>
                        <span className={cl.header} onClick={() => UpdateChildren()}>{isChildrenOpened ? '▾' : '▸'}Children</span>
                        <span className={cl.count}> ({forcedChildCount && childList.length === 0 ? forcedChildCount : childList.length})</span>
                        <ul style={{ display: isChildrenOpened ? 'block' : 'none' }}>
                            <hr style={{ position: 'absolute', left: '0', right: '0' }} />
                            {RenderChildren()}
                        </ul>
                    </li>
                </ul>
            </div>
            <hr className={cl.separator} />
        </li>
    );
}

export default ObjectSection;