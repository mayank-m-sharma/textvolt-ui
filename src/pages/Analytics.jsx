import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Label, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import "./Analytics.css"
import SegmentsSentChart from '../components/organisms/analytics/SegmentsSentChart';

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
  const [segmentsData, setSegmentsData] = useState([]);
  const [segmentsLoading, setSegmentsLoading] = useState(false);
  const [segmentsError, setSegmentsError] = useState(null);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get selected_number from URL query params
  const getSelectedNumber = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('selected_number') || '+12109647879';
  };
  
  const selectedNumber = getSelectedNumber();

  // Function to fetch segments data
  const fetchSegmentsData = async () => {
    if (!startDate || !endDate || startDate > endDate || !selectedNumber) return;
    
    setSegmentsLoading(true);
    setSegmentsError(null);
    
    try {
      // Replace this URL with your actual API endpoint
      const response = await fetch(`https://textvolt-api-v1.onrender.com/api/analytics/get-segments-sent?number=${encodeURIComponent(selectedNumber)}&startDate=${startDate}&endDate=${endDate}`);
      const result = await response.json();
      
      if (result.success) {
        setSegmentsData(result.data || []);
      } else {
        setSegmentsError(result.error || 'Failed to fetch data');
        setSegmentsData([]);
      }
    } catch (error) {
      setSegmentsError(error.message);
      setSegmentsData([]);
    } finally {
      setSegmentsLoading(false);
    }
  };

  // Update charts automatically when period changes
  useEffect(() => {
    if (startDate && endDate && startDate <= endDate && selectedNumber) {
      setOptOut(getRandomPercentage());
      setDelivery(getRandomPercentage());
      fetchSegmentsData();
    }
  }, [startDate, endDate, selectedNumber]);

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
      
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
        <GaugeChart value={optOut} label="Opt-out %" fillColor={COLORS[2]} />
        <GaugeChart value={delivery} label="Delivery %" fillColor={COLORS[3]} />
        <SegmentsSentChart 
          data={segmentsData} 
          isLoading={segmentsLoading} 
          error={segmentsError} 
        />
      </div>

      {(startDate && endDate && startDate > endDate) && (
        <div style={{ color: 'red', marginTop: 12 }}>Start date must be before or equal to end date.</div>
      )}
    </div>
  );
}

export default Analytics;