import React from 'react'
import { LineChart , Legend , Line, XAxis, CartesianGrid, Tooltip } from 'recharts';
import './chart.css'
const data = [
    {
      "name": "1 Week",
      "Amount": 4000,
    },
    {
      "name": "2 Week",
      "Amount": 3000,
    },
    {
      "name": "3 Week",
      "Amount": 2000,
    },
    {
      "name": "4 Week",
      "Amount": 2780,

    },
    
    
  ]


export default function Chart() {
    return (
        <div className='chart'>
           <LineChart width={230} height={150} data={data}
           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          {/* <YAxis /> */}
          <Tooltip />
          <Legend />
          {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" /> */}
          <Line type="monotone" dataKey="Amount" stroke="#82ca9d" />
        </LineChart>
        </div>
    );
}
