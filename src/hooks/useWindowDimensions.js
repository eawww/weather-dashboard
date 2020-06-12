import {useState, useEffect} from 'react';

const useWindowDimensions = () => {
  const [viewHeight, setViewHeight] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);
  const [center, setCenter] = useState({x: 0, y: 0});
  useEffect(() => {
    const setWindowDimensions = () => {
      setViewHeight(window.innerHeight);
      setViewWidth(window.innerWidth);
      setCenter({x: window.innerWidth / 2, y: window.innerHeight / 2})
    }
    window.onresize = setWindowDimensions;
    setWindowDimensions()
  }, []);
  return [center, viewHeight, viewWidth];
}

export default useWindowDimensions;
