import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomCheckbox from "../components/CustomCheckbox/CustomCheckbox";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import CustomTextarea from "../components/CustomTextarea/CustomTextarea";
import InputBox from "../components/InputBox/InputBox";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import SaveOrCancelForm from "../components/SaveOrCancelForm/SaveOrCancelForm";
import Space from "../components/Space/Space";
import { ApiScripts } from "../services/api/scripts";

const ScriptEditPage = () => {

    const [scriptData, setScriptData] = useState({
        name: "",
        code: "",
        targetEvent: "",
        targetType: "",
        targetId: null,
        description: null,
        allowAnonymous: false,
        enabled: false
    });

    const { id } = useParams();

    const navigate = useNavigate();
    const navigateScriptListPage = () => {
        navigate('/admin/scripts');
    }

    function ChangeScriptAttribute(e) {
        setScriptData(prevState => {
            let data = { ...prevState };
            data[e.name] = e.value;
            return data;
        });
    }

    function ChangeScriptAttribute(name, value) {
        setScriptData(prevState => {
            let data = { ...prevState };
            data[name] = value;
            return data;
        });
    }

    function SaveChanges() {
        /*if (scriptData.name !== "" && scriptData.code !== "") {
            if (id === 'add') {
                ApiScripts.createScript(scriptData);
            } else {
                ApiScripts.updateScript(scriptData);
            }
    
            navigateScriptListPage();
        }
        else {
            alert('Name or code fields are empty!');
        }*/

        console.log(scriptData);
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';

        if (id !== 'add') {
            ApiScripts.getScript(id).then(data => {
                setScriptData(data);
            });
        }
    }, []);

    return (
        <div>
            <CustomHeader text={id === 'add' ? 'New script' : 'Script editing'} textColor="#0036a3" textSize="45px" isCenter={true} />
            <Space size="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <InputBox title="Name" name="name" value={scriptData?.name} onChange={ChangeScriptAttribute} />
                <Space size="10px" />
                <InputBox title="Target event" name="targetEvent" value={scriptData.targetEvent} onChange={ChangeScriptAttribute} />
                <Space size="10px" />
                <CustomCheckbox scale="1.4" text="Allow anonymous users" name="allowAnonymous" textSize="16px" checked={scriptData.allowAnonymous} onChange={ChangeScriptAttribute} />
                <Space size="10px" />
                <CustomCheckbox scale="1.4" text="Enabled" name="enabled" textSize="16px" checked={scriptData.enabled} onChange={ChangeScriptAttribute} />
            </ItemsContainer>
            <Space size="10px" />
            <ItemsContainer horizontal="center" vertical="center" margin={{ top: '5px', bottom: '5px' }}>
                <CustomTextarea 
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
                    height="500px" 
                    headerText="Code" 
                    headerSize="20px" 
                    isHeaderCentered={true} 
                    content={scriptData.code} />
                <ItemsContainer horizontal="right" vertical="right" margin={{ top: '5px', bottom: '5px' }}>
                    <SaveOrCancelForm onSave={() => SaveChanges()} onCancel={() => navigateScriptListPage()} />
                    <Space size="25px" />
                </ItemsContainer>
            </ItemsContainer>
        </div>
    );
}

export default ScriptEditPage;