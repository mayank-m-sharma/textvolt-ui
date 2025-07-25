import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Label } from 'recharts';
import "./Analytics.css"
const COLORS = ['#efe811', '#8884d8', '#82ca9d', '#ffc658'];
const FADE_COLOR = '#f0f0f0';

function getRandomData() {
  const a = Math.floor(Math.random() * 60) + 20;
  const b = 100 - a;
  return [
    { name: 'Group A', value: a },
    { name: 'Group B', value: b },
  ];
}

function getRandomPercentage() {
  return Math.floor(Math.random() * 101); // 0 to 100
}

function getDefaultDates() {
  const today = new Date();
  const end = today.toISOString().split('T')[0];
  const startDateObj = new Date(today);
  startDateObj.setDate(today.getDate() - 7);
  // Set time to 12:00 for start date (not visible in input, but for future API use)
  const start = startDateObj.toISOString().split('T')[0];
  return { start, end };
}

function GaugeChart({ value, label, fillColor }) {
  // Full donut: 0% = 0deg, 100% = 360deg
  const gaugeData = [
    { value: value, color: fillColor },
    { value: 100 - value, color: FADE_COLOR },
  ];
  return (
    <div style={{ width: 300, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 8px' }}>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={gaugeData}
            dataKey="value"
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={90}
            outerRadius={120}
            stroke="none"
            isAnimationActive={true}
          >
            {gaugeData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
            <Label
              value={`${value}%`}
              position="center"
              style={{ fontSize: 30, fontWeight: 700, fill: fillColor }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 12, fontWeight: 600, fontSize: 18, color: '#222' }}>{label}</div>
    </div>
  );
}

function Analytics() {
  const { start, end } = getDefaultDates();
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [optOut, setOptOut] = useState(getRandomPercentage());
  const [delivery, setDelivery] = useState(getRandomPercentage());
  const today = new Date().toISOString().split('T')[0];

  // Update charts automatically when period changes
  React.useEffect(() => {
    if (startDate && endDate && startDate <= endDate) {
      setOptOut(getRandomPercentage());
      setDelivery(getRandomPercentage());
    }
  }, [startDate, endDate]);

  const handleDateChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Pie data for Opt-out and Delivery (single value for each)
  const optOutData = optOut !== null ? [
    { name: 'Opt-out', value: optOut },
  ] : [{ name: 'Opt-out', value: 0 }];
  const deliveryData = delivery !== null ? [
    { name: 'Delivery', value: delivery },
  ] : [{ name: 'Delivery', value: 0 }];

  return (
    <div>
      <h2>Analytics</h2>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
        <div>
          <label htmlFor="start-date">Start Time: </label>
          <input
            id="start-date"
            type="date"
            max={today}
            value={startDate}
            onChange={handleDateChange(setStartDate)}
          />
        </div>
        <div>
          <label htmlFor="end-date">End Time: </label>
          <input
            id="end-date"
            type="date"
            max={today}
            value={endDate}
            min={startDate || undefined}
            onChange={handleDateChange(setEndDate)}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
        <GaugeChart value={optOut} label="Opt-out %" fillColor={COLORS[2]} />
        <GaugeChart value={delivery} label="Delivery %" fillColor={COLORS[3]} />
      </div>
      {(startDate && endDate && startDate > endDate) && (
        <div style={{ color: 'red', marginTop: 12 }}>Start date must be before or equal to end date.</div>
      )}
    </div>
  );
}

export default Analytics; 