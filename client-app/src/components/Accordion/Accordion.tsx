import React from 'react';
import cl from './.module.css';
import arrowUp from './images/arrow-up.png';

interface Props {
    children?: React.ReactNode,
    title?: React.ReactNode,
    defaultExpanded?: boolean,
    enabled?: boolean
}

interface State {
    isExpanded: boolean,
    isEnabled: boolean
}

export default class Accordion extends React.Component<Props, State> {

    state = {
        isExpanded: this.props.defaultExpanded === true,
        isEnabled: this.props.enabled ?? true
    };

    private contentRef = React.createRef<HTMLDivElement>();
    private boxRex = React.createRef<HTMLDivElement>();
    private contentHeight = 0;
    private itemsSizes: Array<number> = [];

    componentDidMount() {
        if (!this.contentRef.current) {
            console.error('Ref is null');
            return;
        }

        for (let i = 0; i < this.contentRef.current.children.length; i++) {
            this.itemsSizes.push((this.contentRef.current.children[i] as HTMLDivElement).offsetHeight);
            let resizeObserver = new ResizeObserver((e) => {
                let style = window.getComputedStyle(e[0].target);
                const getMargin = (margin: string) => Number(margin.replace('px', ''));
                this.itemsSizes[i] = (e[0].target as HTMLElement).offsetHeight + getMargin(style.marginTop) + getMargin(style.marginBottom);
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
            <section className={cl.main__box}>
                <div className={cl.title} onClick={() => {
                    if (this.state.isEnabled) {
                        this.setState({ isExpanded: !this.state.isExpanded });
                    }
                }}>
                    {this.props.title}
                    <img src={arrowUp} className={this.state.isExpanded ? cl.arrow__down : cl.arrow__up} alt="arrow" />
                </div>
                <div className={cl.box} ref={this.boxRex} style={{ 'height': this.state.isExpanded ? `${this.contentRef == null ? '0' : this.contentHeight}px` : 0 }}>
                    <div className={cl.content} ref={this.contentRef}>
                        {items}
                    </div>
                </div>
            </section>
        );
    }
}
