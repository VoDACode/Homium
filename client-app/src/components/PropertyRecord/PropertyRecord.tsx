import React from "react";
import Switch from "../Switch/Switch";
import cl from './.module.css';

interface Props {
    editMode?: boolean,
    name?: string,
    value?: string,
    canHaveHistory?: boolean,
    historyLimit?: number,
    MQTTDisplay?: boolean,
    MQTTSub?: boolean,
    OnEditClick?: any,
    OnDeleteClick?: any,
    OnSaveClick?: any,
    OnCancelClick?: any
}

const PropertyRecord = ({ editMode = false, name = '', value = '', canHaveHistory = false, historyLimit = 0, MQTTDisplay = false, MQTTSub = false, OnEditClick, OnDeleteClick, OnSaveClick, OnCancelClick }: Props) => {

    const [hLimit, setHLimit] = React.useState(historyLimit);
    const [valueColor, setValueColor] = React.useState(
        value === '' ? 'black' :
            Number(value) ? 'blue' :
                value !== 'false' && value !== 'true' ? 'green' :
                    'red');

    const canHaveHistoryRef = React.useRef<HTMLInputElement>();
    const MQTTDisplayRef = React.useRef<HTMLInputElement>();
    const MQTTSubRef = React.useRef<HTMLInputElement>();

    function SaveEvent() {
        OnSaveClick({
            key: (document.getElementsByClassName(cl.name_in)[0] as HTMLInputElement).value,
            value: (document.getElementsByClassName(cl.value_in)[0] as HTMLInputElement).value,
            historyLimit: Number((document.getElementsByClassName(cl.history_limit_in)[0] as HTMLInputElement).value),
            canHaveHistory: canHaveHistoryRef.current?.checked,
            mqttProperty: {
                display: MQTTDisplayRef.current?.checked,
                subscribe: MQTTSubRef.current?.checked
            }
        });
    }

    function CheckValueInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value === '') {
            setValueColor('black');
        }
        else if (Number(e.target.value)) {
            setValueColor('blue');
        }
        else if (e.target.value !== 'false' && e.target.value !== 'true') {
            setValueColor('green');
        }
        else {
            setValueColor('red');
        }
    }

    function CheckHisLimInput(e: React.ChangeEvent<HTMLInputElement>) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setHLimit(Number(e.target.value));
            if (e.target.value[0] === '0' && e.target.value.length > 1) {
                e.target.value = e.target.value.substring(1, e.target.value.length - 1);
            }
        }
    }

    function RenderName() {
        if (editMode)
            return <input className={cl.name_in} defaultValue={name} />;
        return <p className={cl.name}>{name}</p>;
    }

    function RenderValue() {
        var color = valueColor;
        if (editMode)
            return <input className={cl.value_in} defaultValue={value} style={{ color: color }} onChange={(e) => CheckValueInput(e)} />;
        return <p className={cl.value} style={{ color: color }}>{value}</p>;
    }

    function RenderHistoryLimit() {
        if (editMode)
            return <input className={cl.history_limit_in} type="number" name="test_name" min="0" step="1"
                onChange={(e) => CheckHisLimInput(e)} value={hLimit} />;
        return <p className={cl.history_limit}>{historyLimit}</p>;
    }

    function RenderCanHaveHistory() {
        if (editMode)
            return <Switch scale={0.9} checked={canHaveHistory} ref={canHaveHistoryRef} />
        return <p className={cl.can_have_history}>{canHaveHistory ? 'true' : 'false'}</p>;
    }

    function RenderMQTTDisplay() {
        if (editMode)
            return <Switch scale={0.9} checked={MQTTDisplay} ref={MQTTDisplayRef} />
        return <p className={cl.MQTT_display}>{MQTTDisplay ? 'true' : 'false'}</p>;
    }

    function RenderMQTTSubscribe() {
        if (editMode)
            return <Switch scale={0.9} checked={MQTTSub} ref={MQTTSubRef} />
        return <p className={cl.MQTT_sub}>{MQTTSub ? 'true' : 'false'}</p>;
    }

    function RenderButtons() {
        if (editMode) {
            return (<div>
                <button onClick={() => SaveEvent()} className={cl.base_button + " " + cl.save_prop_button}>Save</button>
                <button onClick={() => OnCancelClick()} className={cl.base_button + " " + cl.delete_prop_button}>Cancel</button>
            </div>)
        }
        return (<div>
            <button onClick={() => OnEditClick()} className={cl.base_button + " " + cl.edit_prop_button}>Edit</button>
            <button onClick={() => OnDeleteClick()} className={cl.base_button + " " + cl.delete_prop_button}>Delete</button>
        </div>);
    }

    React.useEffect(() => {
        setHLimit(historyLimit);
    }, [editMode, historyLimit]);

    return (
        <div className={cl.property_record}>
            <div className={cl.property_record_content_n + " " + cl.property_record_content}>
                {RenderName()}
            </div>
            <div className={cl.property_record_content_v + " " + cl.property_record_content}>
                {RenderValue()}
            </div>
            <div className={cl.property_record_content_hl + " " + cl.property_record_content}>
                {RenderHistoryLimit()}
            </div>
            <div className={cl.property_record_content_chh + " " + cl.property_record_content}>
                {RenderCanHaveHistory()}
            </div>
            <div className={cl.property_record_content_mqtt_d + " " + cl.property_record_content}>
                {RenderMQTTDisplay()}
            </div>
            <div className={cl.property_record_content_mqtt_s + " " + cl.property_record_content}>
                {RenderMQTTSubscribe()}
            </div>
            <div className={cl.property_record_buttons}>
                {RenderButtons()}
            </div>
        </div>
    );
}

export default PropertyRecord;