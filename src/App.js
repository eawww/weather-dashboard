import React from 'react';
import './App.css';

// Hooks!
import useWeatherData from './hooks/useWeatherData';
import useWindowDimensions from './hooks/useWindowDimensions';

// To plot our temperature data, we'll need to define some things:
// Constants
const MAX_TEMP = 120; // Let's hope the temp doesn't go out of this range
const MIN_TEMP = -20;
const TEMP_RANGE = MAX_TEMP - MIN_TEMP;

// And some helper functions for calculating positions
const heightByDegrees = (degrees) => 100 - (100 * (degrees - MIN_TEMP) / TEMP_RANGE);
// Returns a value 0-100 representing the position of a date between two other dates
const xByTime = (nowDateStr, beginDateStr, endDateStr) => {
  // We really want the raw values of these times so we just grab
  // The good ol' simple "milliseconds since Midnight Jan 1, 1970"
  const now = new Date(nowDateStr).valueOf(); 
  const begin = new Date(beginDateStr).valueOf();
  const end = new Date(endDateStr).valueOf();
  return 100 * ((now - begin) / (end - begin));
}

const App = () => {
  const hourlyWeatherData = useWeatherData();
  const {windowHeight} = useWindowDimensions();

  console.log(hourlyWeatherData);
  return (
    <div className="App">
      {/* Here's our SVG canvas! */}
      <svg
        height="100%"
        width="100%"
        className="svgCanvas"
        viewBox="0 0 100 100"
        // the following 2 props are important because they allow us to position things
        // in terms of percentages of height/width of the svg canvas
        // This won't work for every application but I'm doing it here
        // for simplicity
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line 
          x1="0" y1="0"
          x2="100" y2="100"
          stroke="red"
          strokeWidth={windowHeight * 0.01}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default App;
