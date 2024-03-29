import React from "react";
import { ApiObjects } from "../../services/api/objects";
import { useNavigate } from "react-router-dom";
import cl from "./.module.css";
import ObjectSection from "../../components/ObjectSection/ObjectSection";
import CustomTextarea from "../../components/CustomTextarea/CustomTextarea";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import Space from "../../components/Space/Space";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

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
    path: Array<ObjectShortInfo>,
    children: Array<string>,
    properties: Array<PropertyFullInfo>,
    description: string | null,
    parentId: string | null,
    allowAnonymous: boolean
}

const ObjectListPage = () => {

    const navigate = useNavigate();
    const navToEditObject = (id: string, parentId?: string | null, prop: string = '') => {
        var parent = `?parent=${parentId ?? ''}`;
        var newProp = `&prop=${prop}`;
        navigate(`/admin/objects/${id}${parent}${newProp}`);
    }

    const [isDelWinVisible, setDelWinVisibility] = React.useState(false);
    const [isListLoaded, setIsListLoaded] = React.useState(false);
    const [sortByAsc, setSortMode] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState('');
    const [objectList, setObjectList] = React.useState<Array<ObjectFullInfo>>([]);
    const [idForDelete, setDeletingId] = React.useState<string | null>(null);

    function ChangeSearchValue(value: string) {
        setSearchValue(value);
        setIsListLoaded(false);
    }

    function SortObjectList(list: Array<ObjectFullInfo>, asc: boolean = true) {
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

    function UpdateObjects() {
        if (searchValue === '') {
            ApiObjects.getRootObjectIds().then(async ids => {
                var objects = [];
                for (let i = 0; i < ids.length; i++) {
                    objects.push(await ApiObjects.getObject(ids[i], true));
                }
                setObjectList(objects);
                setIsListLoaded(true);
            });
        }
        else {
            ApiObjects.getObjectsBySearch(searchValue).then(objects => {
                setObjectList(objects);
                setIsListLoaded(true);
            });
        }
    }

    function DeleteObjectRequest(objectId: string) {
        setDelWinVisibility(true);
        setDeletingId(objectId);
    }

    function DeleteObject(objectId: string) {
        setIsListLoaded(false);
        if (isDelWinVisible) setDelWinVisibility(false);

        ApiObjects.removeObject(objectId).then(response => {
            if (response.status === 200) {
                if (isDelWinVisible) setDelWinVisibility(false);
                UpdateObjects();
            } else {
                alert(response.text());
            }
        });
    }

    function RenderObjects() {
        if (!isListLoaded) {
            return (
                <div>
                    <Space height="20px" />
                    <LoadingAnimation size="50px" loadingCurveWidth="11px" />
                </div>
            );
        }

        var rendered = [];
        const fixedObjects = SortObjectList(objectList, sortByAsc);
        for (let i = 0; i < fixedObjects.length; i++) {
            rendered.push(
                <ObjectSection
                    id={fixedObjects[i].id}
                    key={fixedObjects[i].id}
                    name={fixedObjects[i].name}
                    forcedChildCount={fixedObjects[i].children.length}
                    forcedPropCount={Object.keys(fixedObjects[i].properties).length}
                    path={fixedObjects[i].path}
                    modalWindowControl={DeleteObjectRequest}
                    sortByAsc={sortByAsc}
                    onAddChildClick={() => navToEditObject('add', fixedObjects[i].id)}
                    onAddPropertyClick={() => navToEditObject(fixedObjects[i].id, fixedObjects[i].parentId, 'add')}
                    onEditClick={() => navToEditObject(fixedObjects[i].id)}
                    onRemoveClick={() => DeleteObjectRequest(fixedObjects[i].id)} />);
        }

        return rendered;
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateObjects();
    }, [searchValue]);

    return (
        <div>
            <ModalWindow visible={isDelWinVisible}>
                <div className={cl.delete_panel}>
                    <p className={cl.delete_panel_header}>Type 'yes' to confirm that you want to delete the object.</p>
                    <Space height="30px" />
                    <input className={cl.delete_panel_input} placeholder="write here" />
                    <Space height="30px" />
                    <div className={cl.delete_panel_buttons}>
                        <button className={cl.delete_panel_delete_button}
                            onClick={() => {
                                if ((document.getElementsByClassName(cl.delete_panel_input)[0] as HTMLInputElement).value === 'yes') {
                                    DeleteObject(idForDelete ?? "");
                                }
                                else {
                                    alert("The input does not equal 'yes'!");
                                }
                            }}>Delete</button>
                        <button className={cl.delete_panel_cancel_button} onClick={() => setDelWinVisibility(false)}>Cancel</button>
                    </div>
                </div>
            </ModalWindow>
            <Space height="20px" />
            <div className={cl.list_control_panel}>
                <p className={cl.sort_objects_button} onClick={() => setSortMode(prev => { return !prev; })}>{`A ${sortByAsc ? '⇧' : '⇩'}`}</p>
                <Space width="20px" />
                <CustomTextarea font="robotic" placeholder="Search" contentSize="28px" height="33px" width="500px" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => ChangeSearchValue(e.target.value)} />
                <Space width="20px" />
                <div className={cl.add_object_button} onClick={() => navToEditObject('add', '')}>
                    <p>Add object</p>
                </div>
            </div>
            <Space height="10px" />
            <ul className={cl.object_list} style={{ paddingLeft: '1vw' }}>
                <hr className={cl.start_object_line} />
                {RenderObjects()}
            </ul>
            <Space height='50px' />
        </div>
    );
}

export default ObjectListPage;