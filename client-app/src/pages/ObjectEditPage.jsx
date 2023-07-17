import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../components/CustomButton/CustomButton";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import CustomTextarea from "../components/CustomTextarea/CustomTextarea";
import InputBox from "../components/InputBox/InputBox";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import PropertyRecord from "../components/PropertyRecord/PropertyRecord";
import SaveOrCancelForm from "../components/SaveOrCancelForm/SaveOrCancelForm";
import ScrollDiv from "../components/ScrollDiv/ScrollDiv";
import Space from "../components/Space/Space";
import TableHeader from "../components/TableHeader/TableHeader";
import { ApiObjects } from "../services/api/objects";
import CustomCheckbox from "../components/CustomCheckbox/CustomCheckbox";

const ObjectEditPage = () => {

    const { id } = useParams();
    const searchParams = new URLSearchParams(useLocation().search);

    const navigate = useNavigate();
    const navigateObjectListPage = () => {
        navigate('/admin/objects');
    }

    const [objectData, setObjectData] = useState({
        name: '',
        properties: [],
        description: null,
        parentId: null,
        allowAnonymous: false
    });
    const [parentName, setParentName] = useState(null);
    const [sortPropsByAsc, setSortPropsByAsc] = useState(true);
    const [propSearch, setPropSearch] = useState('');
    const [editingProp, setEditingProp] = useState(undefined);

    function RemoveProperty(key) {
        for (let i = 0; i < objectData.properties.length; i++) {
            if (objectData.properties[i].key === key) {
                objectData.properties.splice(i, 1);
                setObjectData(prev => {
                    var newProp = { ...prev };
                    newProp.properties.splice(i, 1);
                    return newProp;
                });
                return;
            }
        }
    }

    function EditPropertyList(prop) {
        var isUnique = true;
        objectData.properties.forEach(el => {
            if (el.key === prop.key && editingProp === '') {
                isUnique = false;
                return;
            }
        });

        if (prop.key !== "" && isUnique && prop.value !== "") {
            if (editingProp === '') {
                objectData.properties.push(prop);
                setEditingProp(undefined);
            }
            else {
                for (let i = 0; i < objectData.properties.length; i++) {
                    if (objectData.properties[i].key === editingProp) {
                        setObjectData(prev => {
                            var newObj = { ...prev };
                            newObj.properties[i] = prop;
                            return newObj;
                        });
                        break;
                    }
                }
                setEditingProp(undefined);
            }
        }
        else {
            var err = "";
            err += prop.key === "" ? "A property must have a name!\n" : "";
            err += !isUnique ? "The name of the property is not unique!\n" : "";
            err += prop.value === "" ? "The property does not have a value!\n" : "";
            alert(err);
        }
    }

    function SortPropertyList(list, asc = true) {
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

    function ChangeObjectAttributeByRef(e) {
        setObjectData(prevState => {
            let data = { ...prevState };
            data[e.name] = e.value;
            return data;
        });
    }

    function ChangeObjectAttributeByValue(name, value) {
        setObjectData(prevState => {
            let data = { ...prevState };
            data[name] = value;
            return data;
        });
    }

    function LoadObjectInfo() {
        if (id !== 'add') {
            ApiObjects.getObject(id, true, 'array').then(obj => {
                setObjectData(prevState => {
                    var newObj = { ...prevState };
                    newObj.name = obj.name;
                    newObj.description = obj.description;
                    newObj.allowAnonymous = obj.allowAnonymous;
                    newObj.properties = obj.properties;
                    newObj.parentId = obj.parentId;
                    return newObj;
                });
            });
        }

        if (searchParams.get('parent') !== '') {
            ApiObjects.getObject(searchParams.get('parent')).then(obj => {
                ChangeObjectAttributeByValue('parentId', obj.id);
                setParentName(obj.name);
            });
        }
        else {
            setParentName('< No parent >');
        }

        if (searchParams.get('prop') === 'add') {
            document.getElementById('prop-list').scrollIntoView({behavior: "smooth"});
            setEditingProp('');
        }
    }

    async function SaveChanges() {
        if (objectData.name !== "") {
            var response1, response2;

            if (id !== 'add') {
                response1 = await ApiObjects.updateObject(
                    id,
                    objectData.name,
                    objectData.description,
                    objectData.allowAnonymous,
                    objectData.parentId
                );

                response2 = await ApiObjects.updateLogicalObject(
                    id,
                    objectData.properties
                );
            }
            else {
                response1 = response2 = await ApiObjects.createObject(
                    objectData.name,
                    objectData.parentId,
                    objectData.description,
                    objectData.allowAnonymous,
                    objectData.properties
                );
            }

            if (response1.ok && response2.ok) {
                navigateObjectListPage();
            }
            else {
                let err = await response.text();
                alert(err);
            }
        }
        else {
            alert("The name field is empty!");
        }
    }

    function RenderProperties() {
        var rendered = [];
        const sortedProps = SortPropertyList(objectData.properties, sortPropsByAsc);

        if (editingProp === '') {
            rendered.push(<div key={''}>
                <PropertyRecord
                    editMode={true}
                    OnSaveClick={(prop) => EditPropertyList(prop)}
                    OnCancelClick={() => setEditingProp(undefined)} />
                <Space height="10px" /></div>);
        }

        for (let i = 0; i < sortedProps.length; i++) {
            if (propSearch !== '' && !sortedProps[i].key.toLowerCase().includes(propSearch.toLowerCase())) {
                continue;
            }

            rendered.push(<div key={sortedProps[i].key}>
                <PropertyRecord
                    editMode={sortedProps[i].key === editingProp}
                    name={sortedProps[i].key}
                    value={sortedProps[i].value}
                    historyLimit={sortedProps[i].historyLimit}
                    canHaveHistory={sortedProps[i].canHaveHistory}
                    MQTTDisplay={sortedProps[i].mqttProperty.display}
                    MQTTSub={sortedProps[i].mqttProperty.subscribe}
                    OnEditClick={() => editingProp === undefined ? setEditingProp(sortedProps[i].key) : alert('You are editing another prop at the moment.')}
                    OnDeleteClick={() => editingProp === undefined ? RemoveProperty(sortedProps[i].key) : alert('You are editing a prop at the moment.')}
                    OnSaveClick={(prop) => EditPropertyList(prop)}
                    OnCancelClick={() => setEditingProp(undefined)} />
                <Space height="10px" />
            </div>);
        }

        if (rendered.length === 0) {
            return <CustomHeader text="There is no properties at the object" textSize="1.5vw" isCenter={true} />
        }

        return rendered;
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        LoadObjectInfo();
    }, []);

    return (
        <div>
            <CustomHeader text={id === 'add' ? 'New object' : 'Object editing'} textColor="#0036a3" textSize="45px" isCenter={true} />
            <Space height="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <div style={{ fontFamily: 'sans-serif', cursor: 'default' }}>
                    <p>Parent</p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '200px',
                        height: '35px',
                        border: '1px solid grey',
                        borderRadius: '5px'
                    }}>
                        <p>{parentName}</p>
                    </div>
                </div>
            </ItemsContainer>
            <Space height="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <InputBox title="Name *" name="name" disabled={false} width="300px" value={objectData.name} onChange={ChangeObjectAttributeByRef} />
                <Space height="10px" />
                <CustomCheckbox scale="1.4" text="Allow anonymous" name="allowAnonymous" textSize="16px" checked={objectData.allowAnonymous} onChange={ChangeObjectAttributeByValue} />
            </ItemsContainer>
            <Space height="20px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <CustomTextarea
                    onChange={(e) => ChangeObjectAttributeByValue('description', e.target.value)}
                    width="500px"
                    height="100px"
                    headerText="Description"
                    headerSize="20px"
                    isHeaderCentered={true}
                    content={objectData.description} />
            </ItemsContainer>
            <Space height="20px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <ScrollDiv idName={"prop-list"} isHeaderCentered={true} headerText="Properties" height="500px" headerSize="20px" backgroundColor="whitesmoke" borderSize="1px" borderRadius='5px' width="90vw" padding="10px"
                    headContent={
                        <div style={{marginTop: '5px', marginLeft: '10px', marginRight: '15px'}}>
                            <div style={{display: 'flex', marginBlock: '10px', width: '100%'}}>
                                <CustomButton text="Add" width="150px" height="40px" backColor="lightgreen" fontSize="20px" onClick={() => editingProp === undefined ? setEditingProp('') : alert('You are editing a prop at the moment.')} />
                                <Space width="10px" />
                                <CustomHeader wrap={false} onClick={() => setSortPropsByAsc(prev => { return !prev; })} text={`A ${sortPropsByAsc ? '⇧' : '⇩'}`} textColor="black" textSize="26px" border="2px solid black" borderRadius="10px" padding="1px" autoWidth={false} />
                                <Space width="10px" />
                                <CustomTextarea font="robotic" placeholder="Search" contentSize="24px" height="30px" width="100%" onChange={e => setPropSearch(e.target.value)} />
                            </div>
                            <TableHeader backColor="#b5b5b5" textColor="black" textSize="1vw" components={[
                                { text: 'name', val: null },
                                { text: 'value', val: null },
                                { text: 'history limit (days)', val: null },
                                { text: 'can have history', val: null },
                                { text: 'MQTT display', val: null },
                                { text: 'MQTT subscribe', val: null },
                                { text: 'actions', val: null }
                            ]} gridMarkUpCols="1fr 1fr 1fr 1fr 1fr 1fr 1fr" />
                        </div>
                    }>
                    {RenderProperties()}
                </ScrollDiv>
                <SaveOrCancelForm disabledSave={false} onSave={() => SaveChanges()} onCancel={() => navigateObjectListPage()} />
            </ItemsContainer>
            <Space height="30px" />
        </div>
    );
}

export default ObjectEditPage;