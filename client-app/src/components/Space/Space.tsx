interface Props {
    height?: string,
    width?: string
}

const Space = ({ height = "0px", width = "0px" }: Props) => {
    return (
        <div style={{
            height: height,
            width: width
        }}/>
    );
}

export default Space;