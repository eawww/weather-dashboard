import React from 'react';
import './App.css';

// Hooks!
import useWeatherData from './hooks/useWeatherData';
import useWindowDimensions from './hooks/useWindowDimensions';


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
      >
        <line 
          x1="0" y1="0"
          x2="100" y2="100"
          stroke="red"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export default App;
