import {useState, useEffect} from 'react';

const useWindowDimensions = () => {
  const [windowHeight, setViewHeight] = useState(0);
  const [windowWidth, setViewWidth] = useState(0);
  const [windowCenter, setCenter] = useState({x: 0, y: 0});
  useEffect(() => {
    const setWindowDimensions = () => {
      setViewHeight(window.innerHeight);
      setViewWidth(window.innerWidth);
      setCenter({x: window.innerWidth / 2, y: window.innerHeight / 2})
    }
    window.onresize = setWindowDimensions;
    setWindowDimensions()
  }, []);
  return {windowCenter, windowHeight, windowWidth};
}

export default useWindowDimensions;
