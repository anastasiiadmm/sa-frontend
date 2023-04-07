import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ChartComponent = () => {
  const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 200, pv: 2400, amt: 2300 },
    { name: 'Page C', uv: 1000, pv: 900, amt: 2400 },
    { name: 'Page D', uv: 400, pv: 2400, amt: 2400 },
  ];

  const data2 = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
  ];

  return (
    <>
      <BarChart width={1000} height={300} data={data} style={{ marginLeft: 13 }}>
        <XAxis dataKey='name' stroke='#8884d8' />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
        <Bar dataKey='uv' fill='#8884d8' barSize={30} />
      </BarChart>

      <ResponsiveContainer width={1040} height={300}>
        <LineChart
          height={300}
          data={data2}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='pv' stroke='#8884d8' activeDot={{ r: 8 }} />
          <Line type='monotone' dataKey='uv' stroke='#82ca9d' />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartComponent;
