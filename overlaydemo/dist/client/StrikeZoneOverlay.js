import { jsx as _jsx } from "react/jsx-runtime";
// StrikeZoneOverlay.tsx
import { useEffect, useRef } from "react";
export default function StrikeZoneOverlay({ pitches, width = 320, height = 480, }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);
        // --- strike-zone rectangle (17" wide ≈ 1.42 ft) ---
        const zoneW = width * 0.6;
        const zoneH = height * 0.45;
        const zx = (width - zoneW) / 2;
        const zy = (height - zoneH) / 2;
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 2;
        ctx.strokeRect(zx, zy, zoneW, zoneH);
        // --- pitch trails ---
        pitches.forEach((p, i) => {
            const t = i / pitches.length; // 0 (oldest) ➞ 1 (newest)
            ctx.globalAlpha = 0.3 + 0.7 * t;
            ctx.strokeStyle =
                p.result === "S" ? "#4caf50" : p.result === "B" ? "#ff5722" : "#2196f3";
            ctx.lineWidth = 2;
            // map physics coords to canvas
            const x0 = zx + zoneW / 2;
            const y0 = zy + zoneH; // release point bottom center
            const scale = zoneW / 4; // 4 ft span horizontally
            const endX = zx + zoneW / 2 + p.px * scale;
            const endY = zy + zoneH / 2 - (p.pz - 2.5) * scale; // center ~ 2.5 ft high
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.bezierCurveTo(x0 + p.pfx_x * scale, y0 - p.pfx_z * scale, endX + p.pfx_x * scale * 0.2, endY + p.pfx_z * scale * 0.2, endX, endY);
            ctx.stroke();
            // draw end-dot
            ctx.globalAlpha = 1;
            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.arc(endX, endY, 3 + 3 * t, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }, [pitches, width, height]);
    return (_jsx("canvas", { ref: canvasRef, style: {
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height,
            pointerEvents: "none",
        } }));
}
