import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import ObjectSection from "../components/ObjectSection/ObjectSection";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import CustomTextarea from "../components/CustomTextarea/CustomTextarea";
import ModalWindow from "../components/ModalWindow/ModalWindow";
import DeletePanel from "../components/DeletePanel/DeletePanel";
import { ApiObjects } from "../services/api/objects";
import Space from "../components/Space/Space";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";
import { useNavigate } from "react-router-dom";

const ObjectListPage = () => {

    const navigate = useNavigate();
    const navToEditObject = (id, parentId, addProp = '') => {
        var parent = `?parent=${parentId ?? ''}`;
        var newProp = `&prop=${addProp}`;
        navigate(`/admin/objects/${id}${parent}${newProp}`);
    }

    const [isDelWinVisible, setDelWinVisibility] = useState(false);
    const [isListLoaded, setIsListLoaded] = useState(false);
    const [sortByAsc, setSortMode] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [objectList, setObjectList] = useState([]);
    const [idForDelete, setDeletingId] = useState(null);

    function ChangeSearchValue(value) {
        setSearchValue(value);
        setIsListLoaded(false);
    }

    function SortObjectList(list, asc = true) {
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

    function DeleteObjectRequest(objectId) {
        setDelWinVisibility(true);
        setDeletingId(objectId);
    }

    function DeleteObject(objectId) {
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
                    onAddPropertyClick={() => navToEditObject(fixedObjects[i].id, fixedObjects[i].id.parentId, 'add')}
                    onEditClick={() => navToEditObject(fixedObjects[i].id)}
                    onRemoveClick={() => DeleteObjectRequest(fixedObjects[i].id)} />);
        }

        rendered.push(<li
            key={"adder"}
            style={{
                cursor: 'pointer',
                color: 'rgb(234, 132, 0)',
                width: 'fit-content',
                border: '5px dotted rgb(255, 38, 0)',
                borderRadius: '10px',
                marginTop: '3px'
            }
            }
            onMouseEnter={e => { e.target.style.backgroundColor = 'cyan' }}
            onMouseLeave={e => { e.target.style.backgroundColor = '' }}
            onClick={() => navToEditObject('add', '')}>
            Add new object</li>);

        return rendered;
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateObjects();
    }, [searchValue]);

    return (
        <div>
            <ModalWindow visible={isDelWinVisible}>
                <DeletePanel
                    header="Type 'yes' to confirm that you want to delete the object."
                    idForDel={idForDelete}
                    onCancelClick={() => setDelWinVisibility(false)}
                    onDeleteClick={DeleteObject} />
            </ModalWindow>
            <CustomHeader text="Object list" textColor="#0036a3" textSize="45px" isCenter={true} />
            <Space height="10px" />
            <ItemsContainer width="97%" inlineFlexMode={true}>
                <CustomHeader wrap={false} onClick={() => setSortMode(prev => { return !prev; })} text={`A ${sortByAsc ? '⇧' : '⇩'}`} textColor="rgb(50, 50, 213)" textSize="26px" border="2px solid rgb(50, 50, 213)" borderRadius="10px" padding="1px" autoWidth={false} />
                <Space width="20px" />
                <CustomTextarea font="robotic" placeholder="Search" contentSize="28px" height="33px" width="500px" onChange={e => ChangeSearchValue(e.target.value)} />
            </ItemsContainer>
            <ul className="object_list" style={{ paddingLeft: '1vw' }}>
                <hr style={{ position: 'absolute', left: '0', right: '0' }} />
                <Space height="3px" />
                {RenderObjects()}
            </ul>
            <Space height='50px' />
        </div>
    );
}

export default ObjectListPage;