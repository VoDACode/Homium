import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import cl from './.module.css';

const SceneCell = ({data}) => {
    const sourceCanvasRef = useRef();

    useEffect(() => {
        var sourceCanvas = sourceCanvasRef.current;
        var sourceContext = sourceCanvas.getContext('2d');

        if (data === undefined) {
            var a1 = 25;
            var b1 = sourceCanvas.height * 0.8;
            sourceContext.fillStyle = 'rgb(8, 0, 161)';
            sourceContext.fillRect((sourceCanvas.width - a1) / 2, (sourceCanvas.height - b1) / 2, a1, b1);
            sourceContext.fillRect((sourceCanvas.width - b1) / 2, (sourceCanvas.height - a1) / 2, b1, a1);
        }
        else {
            
        }
    }, []);

    return (
        <div className={cl.main}>
            <canvas ref={sourceCanvasRef}>Scene</canvas>
        </div>
    );
}

export default SceneCell;