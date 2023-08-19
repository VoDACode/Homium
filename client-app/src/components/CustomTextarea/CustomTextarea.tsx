import Space from "../Space/Space";
import cl from './.module.css';

interface Props {
    placeholder?: string,
    font?: string,
    content?: string,
    contentSize?: string,
    contentStyle?: string,
    width?: string,
    height?: string,
    maxWidth?: string,
    minWidth?: string,
    maxHeight?: string,
    minHeight?: string,
    headerText?: string,
    headerSize?: string,
    headerWeight?: string, 
    headerColor?: string, 
    isHeaderCentered?: boolean, 
    onChange?: any
}

const CustomTextarea = ({ placeholder = '', font = '', content = '', contentStyle = undefined, contentSize = '18px', width = '50px', height = 'default', maxWidth = 'none', minWidth = 'none', maxHeight = 'none', minHeight = 'none', headerText = '', headerSize = '10px', headerWeight = 'normal', headerColor = 'black', isHeaderCentered = false, onChange }: Props) => {

    function SetFont() {
        switch (font) {
            case 'robotic':
                return cl.robotic_font;
            default:
                return '';
        }
    }

    return (
        <div className={cl.main} style={{
            maxWidth: maxWidth,
            minWidth: minWidth,
            maxHeight: maxHeight,
            minHeight: minHeight
        }}>
            <p className={cl.header} style={{
                textAlign: isHeaderCentered ? 'center' : 'left',
                fontSize: headerSize,
                fontWeight: headerWeight,
                color: headerColor
            }}>{headerText}</p>
            <Space height="5px" />
            <textarea
                className={`${cl.cont} ${SetFont()}`}
                onChange={(e) => onChange(e)}
                defaultValue={content}
                placeholder={placeholder}
                style={{
                    width: width,
                    height: height,
                    fontSize: contentSize,
                    fontFamily: contentStyle
                }} />
        </div>
    );
}

export default CustomTextarea;