import cl from './.module.css';

interface Props {
    children?: React.ReactNode,
    visible?: boolean
}

const ModalWindow = ({ children, visible = true }: Props) => {
    var contentVisibility = visible ? "flex" : "none";

    return (
        <div className={cl.back} style={{display: contentVisibility}}>
            <div className={cl.content}>
                {children}
            </div>
        </div>
    );
}

export default ModalWindow;