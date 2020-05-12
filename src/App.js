import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import BarChart from './Components/BarChart'

import { select, line, curveCardinal, scaleLinear, axisBottom, axisRight, scaleBand } from "d3";

function App() {

  const useResizeObserver = (ref) => {
    const [dimensions, setDimensions] = useState(null);
    return dimensions;
  };

  const [data, setData] = useState([25, 30, 54, 12, 123, 44, 60, 121])


  return (
    <React.Fragment>
      <BarChart data={data} />
    </React.Fragment>
  );
}

export default App;
