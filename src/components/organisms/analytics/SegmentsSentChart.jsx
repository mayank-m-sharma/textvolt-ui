import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Label, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { COLORS } from "../../../constants/analytics/tokens";

const SegmentsSentChart = ({ data, isLoading, error }) => {
    if (isLoading) {
        return (
            <div style={{ width: 616, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 8px' }}>
                <div style={{ color: '#666', fontSize: 16 }}>Loading segments data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ width: 616, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 8px' }}>
                <div style={{ color: '#e74c3c', fontSize: 16, marginBottom: 8 }}>Error loading data</div>
                <div style={{ color: '#666', fontSize: 14 }}>{error}</div>
            </div>
        );
    }

    const totalSegments = data.reduce((sum, item) => sum + item.segments, 0);

    return (
        <div style={{ width: 616, height: 300, display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 8px', padding: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, paddingLeft: 24, paddingRight: 24 }}>
                <div style={{ fontWeight: 600, fontSize: 18, color: '#222' }}>Segments Sent</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: COLORS[1] }}>{totalSegments}</div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="displayDate"
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        labelStyle={{ color: '#222', fontWeight: 600 }}
                        formatter={(value) => [value, 'Segments Sent']}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="segments"
                        stroke={COLORS[1]}
                        strokeWidth={3}
                        dot={{ r: 5, stroke: COLORS[1], strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 7 }}
                        isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SegmentsSentChart;