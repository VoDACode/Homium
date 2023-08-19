import cl from './.module.css';

type HeaderColumn = {
    text: string,
    val: string | null
}

interface Props {
    components?: Array<HeaderColumn>,
    gridMarkUpCols?: string,
    sortInfo?: { parameter: string, dir: string },
    backColor?: string,
    textColor?: string,
    textSize?: string,
    onChange?: any
}

const TableHeader = ({ components = [], gridMarkUpCols = undefined, sortInfo = { parameter: '', dir: '' }, backColor = '#e4e4e4', textColor = 'rgb(57, 75, 108)', textSize = '1.5vw', onChange }: Props) => {

    function InsertSortChar(type: string, el: HeaderColumn) {
        if (sortInfo.parameter === el.val) {
            if (type === 'asc') {
                return <span className={cl.attribute}>▴</span>;
            } else if (type === 'desc') {
                return <span className={cl.attribute}>▾</span>;
            }
            else {
                return <span></span>;
            }
        }
    }

    function RenderComponents() {
        var res: any = [];
        var i = 1;
        components.map(el => {
            res.push(
                <div className={cl.cont} key={i}>
                    <p
                        className={cl.attribute}
                        style={{ cursor: !el.val === null ? 'default' : 'pointer' }}
                        onClick={() => {
                            if (el.val) {
                                if (sortInfo.parameter === el.val && sortInfo.dir !== '') {
                                    onChange(el.val, sortInfo.dir === 'asc' ? 'desc' : 'asc');
                                } else {
                                    onChange(el.val, 'asc');
                                }
                            }
                        }}>
                        {el.text}{InsertSortChar(sortInfo.dir, el)}
                    </p></div>);
            i++;
            return true;
        })
        return res;
    }

    return (
        <div className={cl.main} style={{ gridTemplateColumns: gridMarkUpCols, backgroundColor: backColor, color: textColor, fontSize: textSize }}>
            {RenderComponents()}
        </div>
    );
}

export default TableHeader;