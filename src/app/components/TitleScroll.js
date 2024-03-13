// TitleScroll.js
import React, { useState, useEffect, useRef } from 'react';

const TitleScroll = ({ onScroll }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollableDivRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollableDivRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollableDivRef.current;
      const position = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
      setScrollPosition(position);
      
      // Call the onScroll function with the updated scroll position
      onScroll(position);
    };

    if (scrollableDivRef.current) {
      scrollableDivRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableDivRef.current) {
        scrollableDivRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="title">
      <div className="text-block">
        <h1 className={`text ${scrollPosition < 10 ? 'visible' : ''}`}>On April 8, 2024 a total solar eclipse will be viewable across North America.</h1>
        <p className={`text ${scrollPosition > 10 && scrollPosition < 22 ? 'visible' : ''}`}>Total obscuration will first be visible in Mexico, across the the U.S., and finally ending in Canada, lasting 100 minutes from start to end.</p>
        <p className={`text ${scrollPosition > 24 && scrollPosition < 55 ? 'visible' : ''}`}>Totality will last the longest in Torreón, Mexico, at 4 minutes and 28 seconds. However, many of those viewing totality in the U.S. will experience more than 4 minutes of darkness.</p>
        <p className={`text ${scrollPosition > 60 && scrollPosition < 87 ? 'visible' : ''}`}>While roughly 9.5% of the U.S. population (31.6 million people) lives in the path of totality, over 99% of the country will be able to see at least a partial eclipse.</p>
      </div>
      <div ref={scrollableDivRef} className="container">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default TitleScroll;
