import React, { useState } from 'react';
import style from './.module.css';
import arrowUp from './images/arrow-up.png';

export default class Accordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: props.defaultExpanded === true,
            isEnabled: props.enabled ?? true
        };
        this.contentRef = React.createRef(null);
        this.contentHeight = 0;
        this.itemsSizes = [];
    }
    componentDidMount() {
        for (let i = 0; i < this.contentRef.current.children.length; i++) {
            this.itemsSizes.push(this.contentRef.current.children[i].offsetHeight);
            let resizeObserver = new ResizeObserver((e) => {
                this.itemsSizes[i] = e[0].target.offsetHeight + e[0].contentRect.top;
                this.contentHeight = this.itemsSizes.reduce((acc, item) => acc + item, 0);
                this.forceUpdate();
            });
            resizeObserver.observe(this.contentRef.current.children[i]);
        }
        this.contentHeight = this.contentRef.current.offsetHeight;
    }

    render() {
        let items = this.props.children;
        return (
            <section className={style.main__box}>
                <div className={style.title} onClick={() => {
                    if (this.state.isEnabled) {
                        this.setState({ isExpanded: !this.state.isExpanded });
                    }
                }}>
                    {this.props.title}
                    <img src={arrowUp} className={this.state.isExpanded ? style.arrow__down : style.arrow__up} alt="arrow" />
                </div>
                <div className={style.box} style={{ 'height': this.state.isExpanded ? `${this.contentRef == null ? '0' : this.contentHeight}px` : 0 }}>
                    <div className={style.content} ref={this.contentRef}>
                        {items}
                    </div>
                </div>
            </section>
        );
    }
}
