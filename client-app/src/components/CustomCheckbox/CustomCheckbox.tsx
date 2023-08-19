import Space from "../Space/Space";
import cl from './.module.css';

interface Props {
    name?: string,
    checked?: boolean,
    text?: string,
    textSize?: string,
    textWeight?: string,
    textColor?: string,
    scale?: string,
    space?: string,
    onChange?: any
}

const CustomCheckbox = ({ name = undefined, checked = false, text = "", textSize = '15px', textWeight = 'normal', textColor = 'black', scale = "1", space = "10px", onChange }: Props) => {

    const boxScale = {
        msTransform: `scale(${scale})`,
        MozTransform: `scale(${scale})`,
        WebkitTransform: `scale(${scale})`,
        OTransform: `scale(${scale})`,
        transform: `scale(${scale})`
    };

    function changeEvent() {
        onChange(
            (document.getElementsByClassName(cl.box)[0] as HTMLInputElement).name,
            (document.getElementsByClassName(cl.box)[0] as HTMLInputElement).checked
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'fit-content' }}>
            <span className={cl.header} style={{
                fontSize: textSize,
                fontWeight: textWeight,
                color: textColor
            }}>{text}</span>
            <Space width={space} />
            <input
                name={name}
                className={cl.box}
                type='checkbox'
                checked={checked}
                onChange={() => changeEvent()}
                style={boxScale} />
        </div>
    );
}

export default CustomCheckbox;