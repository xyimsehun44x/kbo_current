import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import TensionRing from "./TensionRing";
import StrikeZoneOverlay from "./StrikeZoneOverlay";
function OverlayApp() {
    const [pitches, setPitches] = useState([]);
    /* connect to our local WebSocket relay */
    useEffect(() => {
        const ws = new WebSocket(`ws://${location.host}/feed`);
        ws.onmessage = (e) => setPitches(prev => [...prev, JSON.parse(e.data)].slice(-20));
        return () => ws.close();
    }, []);
    const intensity = Math.min(Math.abs(pitches.at(-1)?.wpa_rt ?? 0) / 0.12, 1);
    return (_jsxs(_Fragment, { children: [_jsx("div", { id: "ring", children: _jsx(TensionRing, { intensity: intensity, size: 80 }) }), _jsx(StrikeZoneOverlay, { pitches: pitches })] }));
}
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(OverlayApp, {}));
