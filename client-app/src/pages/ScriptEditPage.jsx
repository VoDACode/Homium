import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomCheckbox from "../components/CustomCheckbox/CustomCheckbox";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import CustomTextarea from "../components/CustomTextarea/CustomTextarea";
import InputBox from "../components/InputBox/InputBox";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import SaveOrCancelForm from "../components/SaveOrCancelForm/SaveOrCancelForm";
import Space from "../components/Space/Space";
import { ApiObjects } from "../services/api/objects";
import { ApiScripts } from "../services/api/scripts";

const ScriptEditPage = () => {

    const objectEventSet = [
        { name: "init", val: "init" },
        { name: "update", val: "update" },
        { name: "stop", val: "stop" },
        { name: "start", val: "start" },
        { name: "call", val: "call" },
        { name: "remove", val: "remove" }
    ];

    const extensionEventSet = [
        { name: "onmessage", val: "onmessage" }
    ];

    const systemEventSet = [];

    const [scriptData, setScriptData] = useState({
        name: "",
        code: "",
        targetEvent: "",
        targetType: "Object",
        targetId: null,
        description: null,
        allowAnonymous: false,
        enabled: false
    });
    const [itemList, setItemList] = useState([]);
    const [eventList, setEventList] = useState([]);

    const { id } = useParams();

    const navigate = useNavigate();
    const navigateScriptListPage = () => {
        navigate('/admin/scripts');
    }

    function ChangeScriptAttributeByRef(e) {
        setScriptData(prevState => {
            let data = { ...prevState };
            data[e.name] = e.value;
            return data;
        });
    }

    function ChangeScriptAttributeByValue(name, value) {
        setScriptData(prevState => {
            let data = { ...prevState };
            data[name] = value;
            return data;
        });
    }

    function OnTargetTypeChanged(type) {
        if (type === 'Object') {
            ApiObjects.getObjects().then((data) => {
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    items.push({ name: data[i].name, val: data[i].id });
                }
                setItemList(items);
                setEventList(objectEventSet);
                setScriptData(prevState => {
                    var newData = { ...prevState };
                    newData.targetType = type;
                    newData.targetId = items[0].val;
                    newData.targetEvent = objectEventSet[0].val;
                    return newData;
                });
            });
        }
        else if (type === 'Extension') {
            setItemList([]);
            setEventList(extensionEventSet);
        }
        else if (type === 'System') {
            setItemList([]);
            setEventList(systemEventSet);
        }
    }

    async function SaveChanges() {
        if (scriptData.name !== "" && scriptData.code !== "") {
            var response = id === 'add' ? await ApiScripts.createScript(scriptData) : await ApiScripts.updateScript(id, scriptData);
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

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';

        if (id !== 'add') {
            ApiScripts.getScript(id).then(data => {
                OnTargetTypeChanged(data.targetType);
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
                    return newScript;
                });
            });
        }
        else {
            OnTargetTypeChanged('Object');
        }
    }, []);

    return (
        <div>
            <button onClick={() => console.log(scriptData)}>Test</button>
            <CustomHeader text={id === 'add' ? 'New script' : 'Script editing'} textColor="#0036a3" textSize="45px" isCenter={true} />
            <Space size="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <InputBox title="Name" name="name" disabled={false} value={scriptData?.name} onChange={ChangeScriptAttributeByRef} />
                <Space size="10px" />
            </ItemsContainer>
            <ItemsContainer margin={{ top: '5px', bottom: '5px' }} inlineFlexMode={true}>
                <CustomSelect
                    options={eventList}
                    onChange={(e) => ChangeScriptAttributeByValue("targetEvent", e.target.value)}
                    chosenValue={scriptData.targetEvent} type="simple" space="1px" headerText="Target event" headerSize="16px" width="200px" paddingLeft="10px" paddingRight="0" />
                <Space isHorizontal={true} size="10px" />
                <CustomSelect
                    options={itemList}
                    onChange={(e) => ChangeScriptAttributeByValue("targetId", e.target.value)}
                    chosenValue={scriptData.targetId} type="simple" space="1px" headerText="Target item" headerSize="16px" width="200px" enabled={id === "add"} paddingLeft="10px" paddingRight="0" />
                <Space isHorizontal={true} size="10px" />
                <CustomSelect
                    options={[{ name: "Object", val: "Object" }, { name: "Extension", val: "Extension" }, { name: "System", val: "System" }]}
                    onChange={(e) => OnTargetTypeChanged(e.target.value)}
                    chosenValue={scriptData.targetType} type="simple" space="1px" headerText="Target type" headerSize="16px" width="200px" enabled={id === "add"} paddingLeft="10px" paddingRight="0" />
            </ItemsContainer>
            <Space size="10px" />
            <ItemsContainer margin={{ top: '5px', bottom: '5px' }}>
                <CustomCheckbox scale="1.4" text="Allow anonymous users" name="allowAnonymous" textSize="16px" checked={scriptData.allowAnonymous} onChange={ChangeScriptAttributeByValue} />
                <Space size="10px" />
                <CustomCheckbox scale="1.4" text="Enabled" name="enabled" textSize="16px" checked={scriptData.enabled} onChange={ChangeScriptAttributeByValue} />
            </ItemsContainer>
            <Space size="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <CustomTextarea
                    onChange={(e) => ChangeScriptAttributeByValue('description', e.target.value)}
                    width="500px"
                    height="100px"
                    headerText="Description"
                    headerSize="20px"
                    isHeaderCentered={true}
                    content={scriptData.description} />
            </ItemsContainer>
            <Space size="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <CustomTextarea
                    width="700px"
                    onChange={(e) => ChangeScriptAttributeByValue('code', e.target.value)}
                    height="500px"
                    headerText="Code (JavaScript)"
                    headerSize="20px"
                    isHeaderCentered={true}
                    content={scriptData.code}
                    contentStyle="sans-sherif" />
                <ItemsContainer horizontal="right" vertical="right" margin={{ top: '5px', bottom: '5px' }}>
                    <SaveOrCancelForm onSave={() => SaveChanges()} onCancel={() => navigateScriptListPage()} />
                    <Space size="25px" />
                </ItemsContainer>
            </ItemsContainer>
        </div>
    );
}

export default ScriptEditPage;