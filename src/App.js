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
      
    </div>
  );
}

export default App;
