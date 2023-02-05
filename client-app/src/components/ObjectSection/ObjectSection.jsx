import React, { useState, Children } from 'react';
import cl from './.module.css';

const ObjectSection = ({name, children, properties}) => {
    const [isObjectOpened, setObjectState] = useState(false);
    const [isPropsOpened, setPropsState] = useState(false);
    const [isChildrenOpened, setChildrenState] = useState(false);

    return (
        <li className={cl.main}>
            <span className={cl.header} onClick={() => setObjectState(!isObjectOpened)}>{isObjectOpened ? '-' : '+'} {name ?? '...'}</span>
            <ul style={{display: isObjectOpened ? 'block' : 'none'}}>
                <li className={cl.properties}>
                    <span className={cl.header} onClick={() => setPropsState(!isPropsOpened)}>{isPropsOpened ? '-' : '+'} Properties</span>
                    <span className={cl.count}> ({properties.length})</span>
                    <ul style={{display: isPropsOpened ? 'block' : 'none'}}>
                        {properties.map(el => <li className={cl.el} key={el.id}>{el.val}</li>)}
                        <li className={cl.adder}><span>Add new property</span></li>
                    </ul>
                </li>
                <li className={cl.children}>
                    <span className={cl.header} onClick={() => setChildrenState(!isChildrenOpened)}>{isChildrenOpened ? '-' : '+'} Children</span>
                    <span className={cl.count}> ({Children.count(children)})</span>
                    <ul style={{display: isChildrenOpened ? 'block' : 'none'}}>
                        {children}
                        <li className={cl.adder}><span>Add new child</span></li>
                    </ul>
                </li>
            </ul>
        </li>
    );
}

export default ObjectSection;