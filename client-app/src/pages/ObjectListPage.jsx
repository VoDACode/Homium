import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import ObjectSection from "../components/ObjectSection/ObjectSection";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import CustomTextarea from "../components/CustomTextarea/CustomTextarea";
import { ApiObjects } from "../services/api/objects";
import Space from "../components/Space/Space";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";
import { useNavigate } from "react-router-dom";

const ObjectListPage = () => {

    const navigate = useNavigate();
    const navToAddObject = (parentId = '') => {
        var link = parentId !== '' ? `parent=${parentId}` : '';
        navigate(`/admin/objects/add?${link}`);
    }

    const [isListLoaded, setIsListLoaded] = useState(false);
    const [sortByAsc, setSortMode] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [objectList, setObjectList] = useState([]);

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
                if (!isListLoaded) setIsListLoaded(true);
            });
        }
        else {
            ApiObjects.getObjectsBySearch(searchValue).then(objects => {
                setObjectList(objects);
                if (!isListLoaded) setIsListLoaded(true);
            });
        }
    }

    function RenderObjects() {
        if (!isListLoaded)
            return (
                <div>
                    <Space size="20px" />
                    <LoadingAnimation size="50px" loadingCurveWidth="11px" />
                </div>
            );

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
                    onAddChildClick={() => navToAddObject(fixedObjects[i].id)} />);
        }
        return rendered;
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateObjects();
    }, [searchValue]);

    return (
        <div>
            <CustomHeader text="Object list" textColor="#0036a3" textSize="45px" isCenter={true} />
            <Space size="10px" />
            <ItemsContainer width="94%" inlineFlexMode={true}>
                <CustomHeader onClick={() => setSortMode(prev => { return !prev; })} text={`A ${sortByAsc ? '⇧' : '⇩'}`} textColor="rgb(50, 50, 213)" textSize="26px" border="2px solid rgb(50, 50, 213)" borderRadius="10px" padding="1px" autoWidth={false} />
                <Space isHorizontal={true} size="20px" />
                <CustomTextarea font="robotic" placeholder="Search" contentSize="28px" height="33px" width="500px" onChange={e => ChangeSearchValue(e.target.value)} />
            </ItemsContainer>
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
                    onMouseLeave={e => { e.target.style.backgroundColor = '' }}
                    onClick={() => navToAddObject()}>Add new object</li>
            </ul>
        </div>
    );
}

export default ObjectListPage;