import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TimelineAnimation({times}) {
  console.log(times)

  function parseAndDisplayTime(timeString, first) {
    const utcDateTime = `2024-04-08T${timeString}Z`;
    // Parse the UTC time
    const date = new Date(utcDateTime);
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    const localTime = date.toLocaleTimeString('en-US', options);

    if(first){
      return localTime;
    } else {
      return localTime.split(' ')[0];
    }
  }

  // parseAndDisplayTime(times[2])

  const gRef = useRef(null);

  useEffect(() => {
    // Ensure the ref is current before using it
    if (gRef.current) {
      d3.selectAll('rect').remove();
      d3.selectAll('line').remove();
      d3.selectAll('.timeline').remove();
      d3.selectAll('.texts').remove();
      const g = d3.select(gRef.current);
      // Timeline path (e.g., a simple horizontal line)
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 1)
        .attr('x2', '100%')
        .attr('y2', 1)
        .attr('stroke', 'black');

      const textBlock = g.append('g')
        .classed('texts', true)
        .attr('transform', 'translate(0, 20)')

      textBlock.append('text')
        .text(parseAndDisplayTime(times[0], true))
        .attr('text-anchor', 'start')
      
      textBlock.append('text')
        .text(parseAndDisplayTime(times[times.length - 1]))
        .attr('text-anchor', 'end')
        .attr('x', '100%')
      
      if(times.length === 3){
        g.append('rect')
        //  can I calc 50% - 2px?
          .attr('x', '50%')
          .attr('y', -8)
          .attr('width', '2px')
          .attr('height', 16)
          .attr('fill', 'black');
        
        textBlock.append('text')
          .text(parseAndDisplayTime(times[1]))
          .attr('text-anchor', 'middle')
          .attr('x', '50%')
      } else {
        g.append('rect')
          .attr('x', '45.5%')
          .attr('y', -8)
          .attr('width', '9%')
          .attr('height', 16)
          .attr('opacity', .7)
          .attr('fill', 'gray');
        
        textBlock.append('text')
          .text(parseAndDisplayTime(times[1]))
          .attr('text-anchor', 'middle')
          .attr('x', '45.5%') 

        textBlock.append('text')
          .text(parseAndDisplayTime(times[3]))
          .attr('text-anchor', 'middle')
          .attr('x', '54.5%') 
      }
      
      // Moving element (e.g., a circle)
      const movingElement = g.append('circle')
        .classed('timeline', true)
        .attr('cx', 0)
        .attr('cy', 1)
        .attr('r', 5)
        .attr('fill', 'black');
      
      const startTransition = () => {
        movingElement.transition()
          .duration(() => {
            if(times.length === 5){
              return 5500;
            } else {
              return 5000;
            }
          })
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
  }, [times])
  
  return(
    <g ref={gRef} transform={`translate(0, 5)`}></g>
  )
}

export default TimelineAnimation;