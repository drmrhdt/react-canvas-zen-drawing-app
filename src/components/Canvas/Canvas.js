import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  drawCircle,
  drawLine,
  drawRectangle,
  drawSquare
} from "../../utilities/drawFigures";
import styles from "./Canvas.module.scss";

export default function Canvas() {
  const { strokeStyle, fillStyle, shadowColor } = useSelector(
    state => state.colorSelect
  );
  const { shadowBlur, shadowOffsetX, shadowOffsetY } = useSelector(
    state => state.selectShadowParameter
  );

  const size = useSelector(state => state.selectSize.toolSize);
  const lineJoin = useSelector(state => state.selectLineJoin.lineJoin);
  const tool = useSelector(state => state.selectTool.tool);
  const figure = useSelector(state => state.selectFigure.figure);
  const pattern = useSelector(state => state.selectPattern.pattern);

  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState(undefined);
  const canvasRef = useRef(null);

  const startPaint = useCallback(e => {
    const coordinates = getCoordinates(e);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);

  const getCoordinates = e => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;

    return { x, y };
  };

  const draw = useCallback(
    (originalMousePosition, newMousePosition) => {
      if (!canvasRef.current) {
        return;
      }
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      context.shadowColor = shadowColor;
      context.shadowBlur = shadowBlur;
      context.shadowOffsetX = shadowOffsetX;
      context.shadowOffsetY = shadowOffsetY;
      context.fillStyle = fillStyle;
      context.lineWidth = size;
      context.strokeStyle = strokeStyle;

      if (context) {
        // drawLine(originalMousePosition, newMousePosition, context);

        // context.clearRect(0, 0, canvas.width, canvas.height); // clearing before draw new circle

        switch (figure) {
          case "circle":
            drawCircle(originalMousePosition, newMousePosition, size, context);
            break;
          case "rectangle":
            drawRectangle(originalMousePosition, newMousePosition, context);
            break;
          case "square":
            drawSquare(originalMousePosition, newMousePosition, context);
            break;
          case "line":
            drawLine(originalMousePosition, newMousePosition, context);
            break;
          default:
            return;
        }
      }
    },
    [
      figure,
      fillStyle,
      shadowBlur,
      shadowColor,
      shadowOffsetX,
      shadowOffsetY,
      size,
      strokeStyle
    ]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", startPaint);
    return () => {
      canvas.removeEventListener("mousedown", startPaint);
    };
  }, [startPaint]);

  const paint = useCallback(
    e => {
      if (isPainting) {
        const newMousePosition = getCoordinates(e);
        if (mousePosition && newMousePosition) {
          draw(mousePosition, newMousePosition);
          // draw circle always on the new place
          if (pattern === "bubbles") {
            setMousePosition(newMousePosition);
          }
        }
      }
    },
    [isPainting, mousePosition, draw, pattern]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener("mousemove", paint);
    return () => {
      canvas.removeEventListener("mousemove", paint);
    };
  }, [paint]);

  const stopPaint = useCallback(e => {
    setIsPainting(false);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.addEventListener("mouseup", stopPaint);

    return () => {
      canvas.removeEventListener("mouseup", stopPaint);
    };
  }, [stopPaint]);

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      width={document.documentElement.clientWidth - 300}
      height={document.documentElement.clientHeight}
    />
  );
}