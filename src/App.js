import React, {useState} from 'react';
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

const GraphedLine = ({values, fill, ...props}) => {
  const xIncrement = 100 / (values.length - 1);
  return (
    <path
      fill={fill || '#0000'}
      vectorEffect="non-scaling-stroke"
      strokeLinejoin="round"
      d={
        `M 0 ${values[0]}` +
        values.slice(-(values.length - 1)).reduce((acc, value, i) => 
          acc + `L ${(i + 1) * xIncrement} ${value} `,
          '',
        )
      }
      {...props}
    />
  )
}

const DegreeAxisLine = ({degrees, color, strokeWidth}) => {
  const height = heightByDegrees(degrees);
  return (
    <line 
      stroke={color}
      strokeWidth={strokeWidth}
      x1="0"   y1={height}
      x2="100" y2={height}
    />
  )
}

const VerticalLine = ({position, ...props}) => (
  <line
    x1={position} y1="0"
    x2={position} y2="100"
    {...props}
  />
)

const InfoOverlay = ({data}) => {
  const now = new Date(data &&  data.observation_time && data.observation_time.value)
  const precip = data && data.precipitation_probability && data.precipitation_probability.value;
  const temp = data && data.temp && data.temp.value;
  const feelsLike = data && data.feels_like && data.feels_like.value;
  const cloudCover = data && data.cloud_cover && data.cloud_cover.value;
  return (
    <div id="infoOverlay">
      <p style={{color: 'yellow'}}>{now.toString()}</p>
      <p style={{color: 'gray'}}>{`Cloud Cover ${cloudCover}%`}</p>
      <p style={{color: '#c13288'}}>{`Feels Like ${feelsLike}ºF`}</p>
      <p style={{color: 'red'}}>{`Temp ${temp}ºF`}</p>
      <p style={{color: 'cyan'}}>{`Precip ${precip}%`}</p>
    </div>
  )
}

const App = () => {
  const hourlyWeatherData = useWeatherData();
  const {windowHeight, windowWidth} = useWindowDimensions();
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);

  const handleMouseMove = (event) => {
    const xPct = event.clientX / event.target.ownerSVGElement.clientWidth;
    const closestDataIndex = Math.floor(xPct * (hourlyWeatherData.length - 1));
    if(closestDataIndex !== selectedHourIndex){
      setSelectedHourIndex(closestDataIndex);
    }
  }

  const beginTime = hourlyWeatherData[0] && hourlyWeatherData[0].observation_time.value;
  const endTime = hourlyWeatherData[0] && hourlyWeatherData[hourlyWeatherData.length - 1].observation_time.value;

  const lgDegreeAxes = [0, 50, 100];
  const smDegreeAxes = [-10, 10, 20, 30, 40, 60, 70, 80, 90, 110];
  const lgDegreeStrokeWidth = windowHeight * 0.0003;
  const smDegreeStrokeWidth = windowHeight * 0.00008;

  // The data is set up so that we can assume we'll alsways have the same number of
  // sunrises and sunsets
  const sunrises = [...new Set(hourlyWeatherData.map(obj => obj.sunrise.value))];
  const sunsets = [...new Set(hourlyWeatherData.map(obj => obj.sunset.value))];
  return (
    <div className="App">
      <InfoOverlay data={hourlyWeatherData[selectedHourIndex]}/>
      {/* Here's our SVG canvas! */}
      <svg
        height="100%"
        width="100%"
        className="svgCanvas"
        viewBox="0 0 100 100"
        onMouseMove={handleMouseMove}
        // the following 2 props are important because they allow us to position things
        // in terms of percentages of height/width of the svg canvas
        // This won't work for every application but I'm doing it here
        // for simplicity
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="tempGradient"
            gradientTransform="rotate(90)"
          >
            <stop offset="0%" stopColor="red"/>
            <stop offset="100%" stopColor="blue"/>
          </linearGradient>
        </defs>
        <rect
          id="background"
          height="100" width="100"
          fill="#000"
        />
        <g id="dayBlocks">
          {
            sunrises.map((sunriseTime, i) => {
              const start = xByTime(sunriseTime, beginTime, endTime);
              const end = xByTime(sunsets[i], beginTime, endTime);
              return (
                <rect 
                  x={start}
                  y="0"
                  width={end - start}
                  height="100"
                  fill="#5553"
                />
              )
            })
          }
        </g>
        <g id="tempLines">
          {
              smDegreeAxes.map(temp => (
                <DegreeAxisLine
                  degrees={temp}
                  color="#6669"
                  strokeWidth={smDegreeStrokeWidth}
                />
              ))
          }
          {
              lgDegreeAxes.map(temp => (
                <DegreeAxisLine
                  degrees={temp}
                  color="#6669"
                  strokeWidth={lgDegreeStrokeWidth}
                />
              ))
          }
        </g>
        <g id="graphedLines">
          <GraphedLine
            id="precipPercentLine"
            values={hourlyWeatherData.map(hr => hr.cloud_cover.value)}
            stroke="#555"
            strokeWidth={windowHeight * 0.001}
            fill="#6665"
          />
          <GraphedLine
            id="precipPercentLine"
            values={hourlyWeatherData.map(hr => 100 - hr.precipitation_probability.value)}
            stroke="cyan"
            strokeWidth={windowHeight * 0.005}
            fill="#0FF6"
          />
          <GraphedLine
            id="feelsLikeLine"
            values={hourlyWeatherData.map(hr => heightByDegrees(hr.feels_like.value))}
            stroke="#c13288"
            strokeWidth={windowHeight * 0.01}
          />
          <mask id="tempLineMask">
            <GraphedLine
              id="tempLine"
              values={hourlyWeatherData.map(hr => heightByDegrees(hr.temp.value))}
              stroke="white"
              strokeWidth={windowHeight * 0.01}
            />
          </mask>
          <rect
            height="100"
            width="100"
            fill="url(#tempGradient)"
            mask="url(#tempLineMask)"
          />
        </g>
        <VerticalLine
          position={(selectedHourIndex / hourlyWeatherData.length) * 100}
          stroke="yellow"
          strokeWidth={windowWidth * 0.0001}
        />
      </svg>
    </div>
  );
}

export default App;
