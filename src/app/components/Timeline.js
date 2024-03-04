import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TimelineAnimation(svgSelector, data) {

  const gRef = useRef(null);

  useEffect(() => {
    // Ensure the ref is current before using it
    if (gRef.current) {
      const g = d3.select(gRef.current);
      // Timeline path (e.g., a simple horizontal line)
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 1)
        .attr('x2', '100%')
        .attr('y2', 1)
        .attr('stroke', 'black');

      // Moving element (e.g., a circle)
      const movingElement = g.append('circle')
        .attr('cx', 0)
        .attr('cy', 1)
        .attr('r', 10)
        .attr('fill', 'blue');
      
      const startTransition = () => {
        movingElement.transition()
          .duration(5500)
          .ease(d3.easeLinear)
          .attrTween('cx', () => {
            return (t) => {
              return d3.scaleLinear()
                .domain([0, 1])
                .range([0, '100%'])(t); // Assuming the range is in pixel values
            };
          })
          .on('end', startTransition); // Call startTransition again when this transition ends
      };
        
      startTransition();

    }
  }, [])
  
  return(
    <g ref={gRef}></g>
  )
}

export default TimelineAnimation;