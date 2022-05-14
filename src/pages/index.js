import React, { useEffect, useState } from "react";
import Layout from "../components/layout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
import AsyncStorage from '@react-native-async-storage/async-storage';

var W3CWebSocket = require('websocket').w3cwebsocket;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

var dataset1 = [];
var dataset2 = [];
var timestamp_val = [];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Wiliot Test',
    },
  },
};


const IndexPage = ({ data, location }) => {

  var json1 = {};
  var json2 = {};
  var auxData =[{}];

  const [status, setStatus] = useState('');
  const [labels, setLabels] = useState([]);

  var data = {
    labels,
    datasets: [
      {
        label: 'ID 1',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'ID 2',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const handleSaveData = () => {

    setInterval(function () {

      var date = new Date();
      var seconds = date.getMinutes() * 60 + date.getSeconds(); 
      
      var fiveMin = 60 * 5;
      var timeleft = fiveMin - seconds % fiveMin; 
      var result = parseInt(timeleft / 60) + ':' + timeleft % 60; 
      document.getElementById('timeleft').innerHTML = result;

      if (result === '0:1') 
          AsyncStorage.setItem('tempdata', JSON.stringify(auxData));

    }, 500) 

  }
  useEffect(() => {

    // Connect to websocket
    const client = new W3CWebSocket('ws://localhost:8999');

    client.onerror = function () {
      console.log('Connection Error');
      setStatus('Not connected');
    };

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      setStatus('Connected');
      
      json1 = JSON.parse(message.data)[0];
      json2 = JSON.parse(message.data)[1];

      auxData.push(json1);
      auxData.push(json2);

      dataset1.push(json1.temperature);
      dataset2.push(json2.temperature);
      timestamp_val.push(json2.data);

      data.datasets[0].data = dataset1;
      data.datasets[1].data = dataset2;

      // setState
      // dont show data if value bigger than 100
      if (json2.data <= 100)
        setLabels(actualData => [...actualData, timestamp_val]);

    };
    
    // Save data in localstorage
    handleSaveData();

  }, [])

  return (
    <Layout>
      <h1>Hi Wiliot</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Socket Status: {status}</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        Time left to save data:
        <div id="timeleft"></div>

      </div>

      <Line options={options} data={data} />

    </Layout>
  )
}

export default IndexPage
