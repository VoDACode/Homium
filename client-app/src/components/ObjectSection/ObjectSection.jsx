import React, { useRef, useState } from 'react';
import cl from './.module.css';

const ObjectSection = ({name}) => {

    const [propertyList, setPropertyList] = useState([{id: 1, val: 'on'}, {id: 2, val: 'off'}]);
    const [childList, setChildList] = useState([{id: 1, val: 'lamp'}, {id: 2, val: 'flashlight'}, {id: 3, val: 'night light'}]);
    const objUlRef = useRef();
    const propUlRef = useRef();
    const childUlRef = useRef();

    function OpenOrCloseObject() {
        if (objUlRef.current.style.display === 'block') {
            objUlRef.current.style.display = 'none';
        }
        else {
            objUlRef.current.style.display = 'block';
        }
    }

    function OpenOrCloseProperties() {
        if (propUlRef.current.style.display === 'block') {
            propUlRef.current.style.display = 'none';
        }
        else {
            propUlRef.current.style.display = 'block';
        }
    }

    function OpenOrCloseChildren() {
        if (childUlRef.current.style.display === 'block') {
            childUlRef.current.style.display = 'none';
        }
        else {
            childUlRef.current.style.display = 'block';
        }
    }

    return (
        <li className={cl.main}><span onClick={() => OpenOrCloseObject()}>+ {name ?? '...'}</span>
            <ul ref={objUlRef}>
                <li className={cl.properties}><span onClick={() => OpenOrCloseProperties()}>+ Properties</span>
                    <ul ref={propUlRef}>
                        {propertyList.map(el => <li key={el.id}>+ {el.val}</li>)}
                        <li className={cl.adder}><span>Add new property</span></li>
                    </ul>
                </li>
                <li className={cl.children}><span onClick={() => OpenOrCloseChildren()}>+ Children</span>
                    <ul ref={childUlRef}>
                        {childList.map(el => <li key={el.id}>+ {el.val}</li>)}
                        <li className={cl.adder}><span>Add new child</span></li>
                    </ul>
                </li>
            </ul>
        </li>
    );
}

export default ObjectSection;