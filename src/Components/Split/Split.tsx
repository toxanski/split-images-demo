import React, { useEffect, useRef, useState } from 'react';
import { SplitProps } from "./Split.props";
import styles from './Split.module.css';

const Split = ({ left, right }: SplitProps): JSX.Element => {
    const [isDown, setIsDown] = useState<boolean>(false);
    const [lineXCoord, setLineXCoord] = useState<number>(0);
    const [widthLeft, setWidthLeft] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function moveHandler(e: MouseEvent | TouchEvent) {
            setLineXCoord(x => {
                console.log(x)
                return computeOffsetLeft(x, e)
            });
            setWidthLeft(x => computeOffsetLeft(x, e));
        }

        if (isDown) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('touchmove', moveHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('touchmove', moveHandler);
        }
    }, [isDown])

    useEffect(() => {
        if (!containerRef.current) return;

        setLineXCoord(containerRef.current.clientWidth / 2);
        setWidthLeft(containerRef.current.clientWidth / 2);

        function handleUp() {
            return setIsDown(false);
        }

        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);
        return () => {
            window.removeEventListener('mouseup', handleUp)
            window.removeEventListener('touchend', handleUp)
        }
    }, [])

    function press() {
        setIsDown(true);
    }

    function computeOffsetLeft(x: number, e: MouseEvent | TouchEvent) {
        if (!containerRef.current) return 0;

        let currentPos: number
        if ('movementX' in e) {
            currentPos = x + e.movementX;
        } else {
            // текущее положение тача по оси x - отступ слева у контейнера
            currentPos = e.touches[0].pageX - containerRef.current.offsetLeft
        }

        if (currentPos >= 0 && currentPos <= containerRef.current.clientWidth) {
            return currentPos;
        }
        // тек. положение
        return x;
    }

    return (
        <div ref={containerRef} className={styles.right} style={{ backgroundImage: `url(${right})` }}>
            <div
                className={styles.left}
                style={{
                    backgroundImage: `url(${left})`,
                    clipPath: `polygon(0% 0%, ${widthLeft}px 0%, ${widthLeft}px 100%, 0% 100%)`
                }}
            />
            <div
                className={styles.line}
                onMouseDown={press}
                onTouchStart={press}
                style={{ left: lineXCoord }}
            />
        </div>
    );
};

export default Split;