import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiExtensions } from "../../services/api/extensions";
import { ApiObjects } from "../../services/api/objects";
import { ApiScripts } from "../../services/api/scripts";
import cl from "./.module.css";
import CustomCheckbox from "../../components/CustomCheckbox/CustomCheckbox";
import CustomTextarea from "../../components/CustomTextarea/CustomTextarea";
import InputBox from "../../components/InputBox/InputBox";
import ItemsContainer from "../../components/ItemsContainer/ItemsContainer";
import SaveOrCancelForm from "../../components/SaveOrCancelForm/SaveOrCancelForm";
import Space from "../../components/Space/Space";

type NameAndVal = {
    name: string,
    val: string
};

type ScriptData = {
    name: string,
    code: string,
    targetEvent?: string,
    targetType: string,
    targetId?: string,
    description: string,
    allowAnonymous: boolean,
    enabled: boolean
};

const ScriptEditPage = () => {

    const objectEventSet: Array<NameAndVal> = [
        { name: "init", val: "init" },
        { name: "update", val: "update" },
        { name: "stop", val: "stop" },
        { name: "start", val: "start" },
        { name: "call", val: "call" },
        { name: "remove", val: "remove" }
    ];
    const typeSet: Array<NameAndVal> = [
        { name: "Object", val: "Object" },
        { name: "Extension", val: "Extension" },
        { name: "System", val: "System" }
    ];

    const [scriptData, setScriptData] = React.useState<ScriptData>({
        name: "",
        code: "",
        targetEvent: "",
        targetType: "Object",
        targetId: undefined,
        description: "",
        allowAnonymous: false,
        enabled: false
    });

    const [chosenTargetName, setChosenTargetName] = React.useState(null);
    const [currentType, setCurrentType] = React.useState('');
    const [itemList, setItemList] = React.useState<Array<NameAndVal>>([]);
    const [eventList, setEventList] = React.useState<Array<NameAndVal>>([]);

    const { id } = useParams();

    const navigate = useNavigate();
    const navigateScriptListPage = () => {
        navigate('/admin/scripts');
    }

    function ChangeScriptAttributeByRef(e: any) {
        setScriptData(prevState => {
            let data: any = { ...prevState };
            data[e.name] = e.value;
            return data;
        });
    }

    function ChangeScriptAttributeByValue(name: string, value: any) {
        setScriptData(prevState => {
            let data: any = { ...prevState };
            data[name] = value;
            return data;
        });
    }

    function LoadTargetEventsById(targetId: string) {
        if (currentType === 'Object') {
            setEventList(objectEventSet);
            setScriptData(prevState => {
                var newData: any = { ...prevState };
                newData.targetId = targetId;
                return newData;
            });
        }
        else if (currentType === 'Extension') {
            ApiExtensions.getExtensionEvents(targetId).then(events => {
                var evSet: Array<NameAndVal> = [];
                for (let i = 0; i < events.length; i++) {
                    evSet.push({ name: events[i].name, val: events[i].name });
                }
                setEventList(evSet);
                setScriptData(prevState => {
                    var newData = { ...prevState };
                    newData.targetId = targetId;
                    if (evSet.length > 0) {
                        newData.targetEvent = evSet[0].val;
                    }
                    else {
                        newData.targetEvent = undefined;
                    }
                    return newData;
                });
            });
        }
    }

    function OnTargetTypeChanged(type: string) {
        setCurrentType(type);
        if (type === 'Object') {
            ApiObjects.getObjects().then((data) => {
                var items: Array<NameAndVal> = [];
                for (var i = 0; i < data.length; i++) {
                    items.push({ name: data[i].name, val: data[i].id });
                }
                setItemList(items);
                setEventList(objectEventSet);
                if (data.length > 0) {
                    setScriptData(prevState => {
                        var newData = { ...prevState };
                        newData.targetType = type;
                        newData.targetId = items[0].val;
                        newData.targetEvent = objectEventSet[0].val;
                        return newData;
                    });
                }
                else {
                    setScriptData(prevState => {
                        var newData = { ...prevState };
                        newData.targetType = type;
                        newData.targetId = undefined;
                        newData.targetEvent = objectEventSet[0].val;
                        return newData;
                    });
                }
            });
        }
        else if (type === 'Extension') {
            ApiExtensions.getExtensions().then(data => {
                var items: Array<NameAndVal> = [];
                for (let i = 0; i < data.length; i++) {
                    items.push({ name: data[i].name, val: data[i].id });
                }
                setItemList(items);
                if (data.length > 0) {
                    ApiExtensions.getExtensionEvents(data[0].id).then(events => {
                        var evSet: Array<NameAndVal> = [];
                        for (let i = 0; i < events.length; i++) {
                            evSet.push({ name: events[i].name, val: events[i].name });
                        }
                        setEventList(evSet);
                        setScriptData(prevState => {
                            var newData = { ...prevState };
                            newData.targetType = type;
                            newData.targetId = items[0].val;
                            if (evSet.length > 0)
                                newData.targetEvent = evSet[0].val;
                            else
                                newData.targetEvent = undefined;
                            return newData;
                        });
                    });
                }
                else {
                    setEventList([]);
                    setScriptData(prevState => {
                        var newData = { ...prevState };
                        newData.targetType = type;
                        newData.targetId = undefined;
                        newData.targetEvent = undefined;
                        return newData;
                    });
                }
            });
        }
        else if (type === 'System') {
            setItemList([]);
            setEventList([]);
            setScriptData(prevState => {
                var newData = { ...prevState };
                newData.targetType = type;
                newData.targetId = undefined;
                newData.targetEvent = undefined;
                return newData;
            });
        }
    }

    function RenderSelectMenus() {
        var events: Array<React.ReactNode> = [];
        var items: Array<React.ReactNode> = [];
        var types: Array<React.ReactNode> = [];

        eventList.forEach(el => {
            events.push(<option className={cl.select_option} value={el.val} key={el.val}>{el.name}</option>);
        });
        itemList.forEach(el => {
            items.push(<option className={cl.select_option} value={el.val} key={el.val}>{el.name}</option>);
        });
        typeSet.forEach(el => {
            types.push(<option className={cl.select_option} value={el.val} key={el.val}>{el.name}</option>);
        });


        if (id !== 'add') {
            return (
                <>
                    <div className={cl.select_list_cont}>
                        <p className={cl.select_list_header}>Target event *</p>
                        <Space height="1px" />
                        <select className={cl.select_list}
                            onChange={(e) => ChangeScriptAttributeByValue("targetEvent", e.target.value)}
                            value={scriptData.targetEvent}>
                            {events}
                        </select>
                    </div>
                    <Space width="10px" />
                    <div style={{ fontFamily: 'sans-serif', cursor: 'default' }}>
                        <p>Target item</p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '200px',
                            height: '35px',
                            border: '1px solid grey',
                            borderRadius: '5px'
                        }}>
                            <p>{chosenTargetName}</p>
                        </div>
                    </div>
                    <Space width="10px" />
                    <div style={{ fontFamily: 'sans-serif', cursor: 'default' }}>
                        <p>Target type</p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'sans-serif',
                            width: '200px',
                            height: '35px',
                            border: '1px solid grey',
                            borderRadius: '5px'
                        }}>
                            <p>{scriptData.targetType}</p>
                        </div>
                    </div>
                </>
            );
        }
        else {
            return (
                <>
                    <div className={cl.select_list_cont}>
                        <p className={cl.select_list_header}>Target event *</p>
                        <Space height="1px" />
                        <select className={cl.select_list}
                            onChange={(e) => ChangeScriptAttributeByValue("targetEvent", e.target.value)}
                            value={eventList.length > 0 ? scriptData.targetEvent : undefined}>
                            {events}
                        </select>
                    </div>
                    <Space width="10px" />
                    <div className={cl.select_list_cont}>
                        <p className={cl.select_list_header}>Target item *</p>
                        <Space height="1px" />
                        <select className={cl.select_list}
                            onChange={(e) => LoadTargetEventsById(e.target.value)}
                            value={itemList.length > 0 ? scriptData.targetId : undefined}>
                            {items}
                        </select>
                    </div>
                    <Space width="10px" />
                    <div className={cl.select_list_cont}>
                        <p className={cl.select_list_header}>Target type *</p>
                        <Space height="1px" />
                        <select className={cl.select_list}
                            onChange={(e) => OnTargetTypeChanged(e.target.value)}
                            value={typeSet.length > 0 ? scriptData.targetType : undefined}>
                            {types}
                        </select>
                    </div>
                </>
            );
        }
    }

    async function SaveChanges() {
        if (scriptData.name !== "" && scriptData.code !== "" && scriptData.targetId !== null && scriptData.targetEvent !== "" && scriptData.targetEvent !== null) {
            var response = id === 'add' ? await ApiScripts.createScript(scriptData) : await ApiScripts.updateScript(id ?? "", scriptData);
            if (response.ok) {
                navigateScriptListPage();
            }
            else {
                let err = await response.text();
                alert(err);
            }
        }
        else {
            alert('Some of the field inputs are invalid!');
        }
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';

        if (id !== 'add') {
            ApiScripts.getScript(id ?? "").then(data => {
                setScriptData(prevState => {
                    var newScript = { ...prevState };
                    newScript.allowAnonymous = data.allowAnonymous;
                    newScript.code = data.code;
                    newScript.name = data.name;
                    newScript.description = data.description;
                    newScript.enabled = data.enabled;
                    newScript.targetEvent = data.targetEvent;
                    newScript.targetId = data.targetId;
                    newScript.targetType = data.targetType;

                    if (data.targetType === 'Object') {
                        setEventList(objectEventSet);
                        ApiObjects.getObject(data.targetId).then(obj => {
                            setChosenTargetName(obj.name);
                        });
                    }
                    else if (data.targetType === 'Extension') {
                        ApiExtensions.getExtension(data.targetId).then(ext => {
                            ApiExtensions.getExtensionEvents(ext.id).then(events => {
                                var items = [];
                                for (let i = 0; i < events.length; i++) {
                                    items.push({ name: events[i].name, val: events[i].name });
                                }
                                setEventList(items);
                            });
                            setChosenTargetName(ext.name);
                        });
                    }
                    else if (data.targetType === 'System') {

                    }

                    return newScript;
                });
            });
        }
        else {
            OnTargetTypeChanged('Object');
        }
    }, [id]);

    return (
        <div>
            <h1 className={cl.page_header}>{id === 'add' ? 'New script' : 'Script editing'}</h1>
            <Space height="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <InputBox title="Name *" name="name" disabled={false} value={scriptData?.name} onChange={ChangeScriptAttributeByRef} />
                <Space height="10px" />
            </ItemsContainer>
            <ItemsContainer margin={{ top: '5px', bottom: '5px' }} inlineFlexMode={true}>
                {RenderSelectMenus()}
            </ItemsContainer>
            <Space height="10px" />
            <ItemsContainer margin={{ top: '5px', bottom: '5px' }}>
                <CustomCheckbox scale="1.4" text="Allow anonymous users" name="allowAnonymous" textSize="16px" checked={scriptData.allowAnonymous} onChange={ChangeScriptAttributeByValue} />
                <Space height="10px" />
                <CustomCheckbox scale="1.4" text="Enabled" name="enabled" textSize="16px" checked={scriptData.enabled} onChange={ChangeScriptAttributeByValue} />
            </ItemsContainer>
            <Space height="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <CustomTextarea
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => ChangeScriptAttributeByValue('description', e.target.value)}
                    font="robotic"
                    width="500px"
                    height="100px"
                    headerText="Description"
                    headerSize="20px"
                    isHeaderCentered={true}
                    content={scriptData.description} />
            </ItemsContainer>
            <Space height="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <CustomTextarea
                    width="700px"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => ChangeScriptAttributeByValue('code', e.target.value)}
                    height="500px"
                    headerText="Code (JavaScript) *"
                    headerSize="20px"
                    isHeaderCentered={true}
                    content={scriptData.code} />
                <ItemsContainer horizontal="right" vertical="right" margin={{ top: '5px', bottom: '5px' }}>
                    <SaveOrCancelForm onSave={() => SaveChanges()} onCancel={() => navigateScriptListPage()} />
                    <Space height="25px" />
                </ItemsContainer>
            </ItemsContainer>
        </div>
    );
}

export default ScriptEditPage;