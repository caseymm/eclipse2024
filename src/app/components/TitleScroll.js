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
      <div ref={scrollableDivRef} className="container">
        <h1>TK TK</h1>
        <p style={{'position': 'fixed'}}>Scroll position: {scrollPosition}</p>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
    </div>
  );
};

export default TitleScroll;