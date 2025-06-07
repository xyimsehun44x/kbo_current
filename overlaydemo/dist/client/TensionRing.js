import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export default function TensionRing({ intensity, size = 80 }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);
        const lineW = 6;
        const r = size / 2 - lineW;
        ctx.clearRect(0, 0, size, size);
        // background circle
        ctx.strokeStyle = "#4448";
        ctx.lineWidth = lineW;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
        ctx.stroke();
        // foreground arc
        ctx.strokeStyle =
            intensity < 0.6 ? "#4caf50" : intensity < 0.85 ? "#ff9800" : "#f44336";
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * intensity);
        ctx.stroke();
        // center text
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${size * 0.28}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${Math.round(intensity * 100)}%`, size / 2, size / 2);
    }, [intensity, size]);
    return (_jsx("canvas", { ref: canvasRef, style: { width: size, height: size, borderRadius: "50%" } }));
}
