import React, { useEffect, useRef, useState } from "react";
import Switch from "../Switch/Switch";
import cl from './.module.css';

const PropertyRecord = ({ editMode = false, name = '', value = '', canHaveHistory = false, historyLimit = 0, MQTTDisplay = false, MQTTSub = false, OnEditClick, OnDeleteClick, OnSaveClick, OnCancelClick }) => {

    const [hLimit, setHLimit] = useState(historyLimit);
    const [valueColor, setValueColor] = useState(
        value === '' ? 'black' :
        !isNaN(value) ? 'blue' : 
        value !== 'false' && value !== 'true' ? 'green' :
        'red');

    const nameRef = useRef();
    const valueRef = useRef();
    const historyLimitRef = useRef();
    const canHaveHistoryRef = useRef();
    const MQTTDisplayRef = useRef();
    const MQTTSubRef = useRef();

    function SaveEvent() {
        OnSaveClick({
            key: nameRef.current.value,
            value: valueRef.current.value,
            historyLimit: Number(historyLimitRef.current.value),
            canHaveHistory: canHaveHistoryRef.current.checked,
            mqttProperty: {
                display: MQTTDisplayRef.current.checked,
                subscribe: MQTTSubRef.current.checked
            }
        });
    }

    function CheckValueInput(e) {
        if (e.target.value === '') {
            setValueColor('black');
        }
        else if (!isNaN(e.target.value)) {
            setValueColor('blue');
        }
        else if (e.target.value !== 'false' && e.target.value !== 'true') {
            setValueColor('green');
        }
        else {
            setValueColor('red');
        }
    }

    function CheckHisLimInput(e) {
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
            return <input className={cl.name_in} defaultValue={name} ref={nameRef} />;
        return <p className={cl.name}>{name}</p>;
    }

    function RenderValue() {
        var color = valueColor;
        if (editMode)
            return <input className={cl.value_in} defaultValue={value} style={{ color: color }} ref={valueRef} onChange={(e) => CheckValueInput(e)} />;
        return <p className={cl.value} style={{ color: color }}>{value}</p>;
    }

    function RenderHistoryLimit() {
        if (editMode)
            return <input className={cl.history_limit_in} type="number" name="test_name" min="0" step="1"
                onChange={(e) => CheckHisLimInput(e)} value={hLimit} ref={historyLimitRef} />;
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
                <button type="save" onClick={() => SaveEvent()} className={ cl.base_button}>Save</button>
                <button type="delete" onClick={() => OnCancelClick()} className={ cl.base_button}>Cancel</button>
            </div>)
        }
        return (<div>
            <button type="edit" onClick={() => OnEditClick()} className={ cl.base_button}>Edit</button>
            <button type="delete" onClick={() => OnDeleteClick()} className={ cl.base_button}>Delete</button>
        </div>);
    }

    useEffect(() => {
        setHLimit(historyLimit);
    }, [editMode, historyLimit]);

    return (
        <div className={cl.box}>
            <div className={cl.content_n + " " + cl.content}>
                {RenderName()}
            </div>
            <div className={cl.content_v + " " + cl.content}>
                {RenderValue()}
            </div>
            <div className={cl.content_hl + " " + cl.content}>
                {RenderHistoryLimit()}
            </div>
            <div className={cl.content_chh + " " + cl.content}>
                {RenderCanHaveHistory()}
            </div>
            <div className={cl.content_mqtt_d + " " + cl.content}>
                {RenderMQTTDisplay()}
            </div>
            <div className={cl.content_mqtt_s + " " + cl.content}>
                {RenderMQTTSubscribe()}
            </div>
            <div className={cl.buttons}>
                {RenderButtons()}
            </div>
        </div>
    );
}

export default PropertyRecord;