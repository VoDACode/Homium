import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import DeletePanel from "../components/DeletePanel/DeletePanel";
import InputBox from "../components/InputBox/InputBox";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import ModalWindow from "../components/ModalWindow/ModalWindow";
import ScriptRecord from "../components/ScriptRecord/ScriptRecord";
import Space from "../components/Space/Space";
import TableHeader from "../components/TableHeader/TableHeader";
import YesNoPanel from "../components/YesNoPanel/YesNoPanel";
import { ApiScripts } from "../services/api/scripts";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";
import { CookieManager } from "../services/CookieManager";

const ScriptListPage = () => {

    const [isListLoaded, setIsListLoaded] = useState(false);
    const [askBeforeExecPermission, setAskBeforeExecPermission] = useState(CookieManager.get('ask_for_exec_script') === '1' ? true : false);
    const [isDelWinVisible, setDelWinVisibility] = useState(false);
    const [isExecWinVisible, setExecWinVisibility] = useState(false);
    const [sortMode, setSortMode] = useState({ parameter: '', dir: '' });
    const [idForExec, setExecId] = useState(null);
    const [idForDelete, setDeletingId] = useState(null);
    const [search, setSearch] = useState('');
    const [scripts, setScrips] = useState([]);

    const navigation = useNavigate();
    const navToAddScript = () => navigation('add');

    function ExecuteScriptRequest(scriptId) {
        if (askBeforeExecPermission) {
            setExecWinVisibility(true);
            setExecId(scriptId);
        }
        else {
            ExecuteScript(scriptId);
        }
    }

    async function ExecuteScript(id) {
        var response = await ApiScripts.executeScript(id);
        if (response.ok) {
            setExecWinVisibility(false);
        }
        else {
            alert('Execution failed!');
        }
    }

    function DeleteScriptRequest(scriptId) {
        setDelWinVisibility(true);
        setDeletingId(scriptId);
    }

    function DeleteScript(scriptId) {

        setIsListLoaded(false);
        if (isDelWinVisible) setDelWinVisibility(false);

        ApiScripts.deleteScript(scriptId).then(response => {
            if (response.status === 200) {
                if (isDelWinVisible) setDelWinVisibility(false);
                UpdateScripts();
            } else {
                alert(response.text());
            }
        });
    }

    function SortScriptList(list, mode) {
        var arr = [...list];

        switch (mode.parameter) {
            case 'name':
                arr.sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                        return mode.dir === 'asc' ? -1 : 1;
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                        return mode.dir === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
                break;
            case 'description':
                arr.sort((a, b) => {
                    if (a.description.toLowerCase() < b.description.toLowerCase()) {
                        return mode.dir === 'asc' ? -1 : 1;
                    }
                    if (a.description.toLowerCase() > b.description.toLowerCase()) {
                        return mode.dir === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
                break;
            default:
                break;
        }

        return arr;
    }

    function UpdateScripts() {
        ApiScripts.getScriptsId().then(data => {
            ApiScripts.getScripts(data).then(data => {
                setScrips(data);
                setIsListLoaded(true);
            });
        });
    }

    function RenderScriptList() {
        if (!isListLoaded)
            return (
                <div>
                    <Space height="20px" />
                    <LoadingAnimation size="70px" loadingCurveWidth="11px" isCenter={true} />
                </div>
            );

        var res = [];
        var fixedScripts = [];

        for (var i = 0; i < scripts.length; i++) {
            fixedScripts.push({
                id: scripts[i].id,
                name: scripts[i].name === '' ? '—' : scripts[i].name,
                description: scripts[i].description === '' ? '—' : scripts[i].description,
            });
        }

        const sortedScripts = SortScriptList(fixedScripts, sortMode);

        for (let i = 0; i < sortedScripts.length; i++) {
            if (search !== '' && !sortedScripts[i].name.toLowerCase().includes(search.toLowerCase()) &&
                !sortedScripts[i].description.toLowerCase().includes(search.toLowerCase())) {
                continue;
            }
            res.push(
                <div key={sortedScripts[i].id}>
                    <Space height="20px" />
                    <ScriptRecord
                        nameAttr={sortedScripts[i].name}
                        descriptionAttr={sortedScripts[i].description}
                        OnExecClick={() => ExecuteScriptRequest(sortedScripts[i].id)}
                        OnEditClick={() => navigation(`/admin/scripts/${sortedScripts[i].id}`)}
                        OnDeleteClick={() => DeleteScriptRequest(sortedScripts[i].id)} />
                </div>
            );
        }

        return res;
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateScripts();
    }, []);

    return (
        <div>
            <ModalWindow visible={isDelWinVisible}>
                <DeletePanel
                    header="Type 'yes' to confirm that you want to delete the script."
                    idForDel={idForDelete}
                    onCancelClick={() => setDelWinVisibility(false)}
                    onDeleteClick={DeleteScript} />
            </ModalWindow>
            <ModalWindow visible={isExecWinVisible}>
                <YesNoPanel
                    checkboxName="ask_for_exec_script"
                    checkboxValue={askBeforeExecPermission}
                    checkboxText="Always ask"
                    includeCheckbox={true}
                    header="Do you want to run the script?"
                    noPressed={() => setExecWinVisibility(false)}
                    yesPressed={() => ExecuteScript(idForExec)}
                    onCheckboxCheck={(name, value) => {
                        setAskBeforeExecPermission(value);
                        CookieManager.set(name, value === true ? '1' : '0');
                    }} />
            </ModalWindow>
            <CustomHeader text="Script list" textColor="#0036a3" textSize="45px" isCenter={true} />
            <ItemsContainer width="96%">
                <InputBox width="340px" value={search} onChange={(e) => setSearch(e.value)} placeholder="Search" />
                <div style={{ display: 'flex' }}>
                    <Space width="110px" />
                    <InputBox width="120px" type="button" value="Add Script" onClick={() => navToAddScript()} />
                </div>
            </ItemsContainer>
            <Space height="30px" />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '96%' }}>
                    <TableHeader
                        components={[
                            { text: "name", val: "name" },
                            { text: "description", val: "description" },
                            { text: "actions", val: null }]}
                        gridMarkUpCols="1fr 1fr 1fr"
                        sortInfo={sortMode}
                        onChange={(param, direction) => setSortMode({ parameter: param ?? '', dir: direction ?? '' })} />
                    {RenderScriptList()}
                </div>
            </div>
        </div>
    );
}

export default ScriptListPage;