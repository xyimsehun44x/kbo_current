// src/MomentumChart.jsx
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

export default function MomentumChart({ csvUrl }) {
  const [data, setData] = useState([]);
  const [team, setTeam] = useState('all'); // or 'away' / 'home'

  useEffect(() => {
    fetch(csvUrl)
      .then(r => r.text())
      .then(txt => {
        const lines = txt.trim().split(/\r?\n/);
        const [head, ...rows] = lines.map(l => l.replace(/^\ufeff/, ''));
        const [,, ...fields] = head.split(','); 
        // assume fields like: inning,aft_wpa_rt,wpa_rt, ...
        const parsed = rows.map(r => {
          const cols = r.split(',');
          return {
            inning: cols[0],
            wpa: parseFloat(cols[1]),
            delta: parseFloat(cols[2]),
          };
        });
        setData(parsed);
      });
  }, [csvUrl]);

  return (
    <div style={{ width:'100%', height: '100%' }}>
      <div style={{ textAlign:'center', marginBottom:8 }}>
        <button onClick={()=>setTeam(t=> t==='all'?'away': t==='away'?'home':'all')}>
          {team==='all' ? 'Show Away' : team==='away' ? 'Show Home' : 'Show All'}
        </button>
      </div>
      <ResponsiveContainer width="100%" height="60%">
        <LineChart data={data}>
          <XAxis dataKey="inning" />
          <YAxis unit="%" />
          <CartesianGrid stroke="#444" />
          <Tooltip formatter={(val) => val.toFixed(1)+'%'} />
          <Line
            type="monotone"
            dataKey="wpa"
            stroke={team==='away'?'#ff4d4d':team==='home'?'#4d94ff':'#00cc99'}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height="35%">
        <BarChart data={data}>
          <XAxis dataKey="inning" />
          <YAxis />
          <CartesianGrid stroke="#444" />
          <Tooltip formatter={(val) => val.toFixed(1)+'%'} />
          <Bar
            dataKey="delta"
            fill={team==='away'?'#ff4d4d':team==='home'?'#4d94ff':'#00cc99'}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
