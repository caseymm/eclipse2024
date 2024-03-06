"use client"
import * as d3 from 'd3'
import overlap from '../output.json';
import { useEffect, useState, useRef } from 'react';

const RenderCircle = ({ data, obscuration, radius, wxh, length }) => {
  console.log('sss')
  let lineData = [
    [],
    [],
    []
  ];

  const begin = data.properties.local_data.filter(item => item.phenomenon === 'Eclipse Begins')[0];
  const end = data.properties.local_data.filter(item => item.phenomenon === 'Eclipse Ends')[0];

  const beginVertexAngle = Math.round(parseFloat(begin.vertex_angle));
  const endVertexAngle = Math.round(parseFloat(end.vertex_angle));
  let midVertexAngle = Math.round((beginVertexAngle + endVertexAngle) / 2);
  if(midVertexAngle < 180 && data.geometry.coordinates[0] > -97){
    midVertexAngle += 180;
  }
  // console.log(data.properties.local_data)
  // console.log(beginVertexAngle, endVertexAngle)
  const gRef = useRef();
  const gParentRef = useRef();
  const moon = useRef(null);
  const moonPath = useRef(null);
  const gTimelineRef = useRef(null);
  const movingElement = useRef(null);
  const filterRef = useRef();

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

  useEffect(() => {
    if (moon.current) {
      moon.current.interrupt();
    }
    if (d3.select(gParentRef.current)) {
      console.log('interrupt transition rect')
      d3.select(gParentRef.current)
        .interrupt()
        .attr('fill', '#cfedfc');
    }
    drawTimeline();
    drawCircles();
  }, [data, obscuration, length]);


  const drawTimeline = () => {
    if (gTimelineRef.current) {
      const times = data.properties.local_data.map(d => d.time);
      d3.selectAll('.shade').remove();
      d3.selectAll('line').remove();
      d3.selectAll('.timeline').remove();
      d3.selectAll('.texts').remove();
      const g = d3.select(gTimelineRef.current);
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
          .attr('fill', 'black')
          .classed('shade', true);
        
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
          .attr('fill', 'gray')
          .classed('shade', true);
        
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
      movingElement.current = g.append('circle')
        .classed('timeline', true)
        .attr('cx', 0)
        .attr('cy', 1)
        .attr('r', 5)
        .attr('fill', 'black');
     
    }
  }


  const drawCircles = () => {
    const g = d3.select(gRef.current);
    g.selectAll('path').remove();
    g.selectAll('.math').remove();
    g.selectAll('.moon').remove();
    // x = r * sin(-i),  y = r * cos(-i)
    [...Array(360).keys()].forEach(i => {
      let color = "";
      let angle = (i - 270) * Math.PI / 180; // Convert degrees to radians and offset by 90 degrees
      let cx = radius * Math.cos(-angle);
      let cy = radius * Math.sin(-angle);

      if(i === beginVertexAngle){
        color = "green";
        // generate start circle center
        cx = cx*2
        cy = cy*2
        lineData[0] = [cx, cy]
      }
      if(i === endVertexAngle){
        color = "red";
        // generate end circle center
        cx = cx*2
        cy = cy*2
        lineData[2] = [cx, cy]
      }
      if(i === midVertexAngle){
        const d = overlap[obscuration.replace('%', '')]
        color = "pink";
        cx = cx*d
        cy = cy*d
        lineData[1] = [cx, cy]
      }
      if(color !== ""){
        g.append('circle')
         .attr('cx', cx)
         .attr('cy', cy)
         .attr('r', 0)
         .attr('i', i)
         .attr('fill', color)
         .classed('math', true)
      }
    })
    drawPaths();
  }

  const drawPaths = () => {
    const g = d3.select(gRef.current);
    // Define the Bezier curve generator
    const curve = d3.curveNatural; // You can choose different interpolation types

    const line = d3.line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(curve); // Apply the Bezier curve to the line
    
    // Add the Bezier curve path to the
    moonPath.current = g.append('path')
      .datum(lineData) // Bind the data
      .attr('d', line) // Use the line generator
      // .attr('stroke', 'red')
      .attr('fill', 'none');
    
    moon.current = g.append('circle')
      .attr('r', radius)
      .attr('fill', '#cfedfc')
      .classed('moon', true);
    
    animateCircle();
  };

  const animateCircle = () => {
    if (moon.current) {
      animateFirstHalf();
    }
  };
  
  const animateFirstHalf = () => {

    // d3.select(filterRef.current).transition()
    //   .duration(2500)
    //   .ease(d3.easeLinear)
    //   .attr("stdDeviation", () => {
    //     if(length === 5){
    //       return '20';
    //     } else {
    //       return '5';
    //     }
    //   })
    
    if(length === 5){
      setTimeout(() => {
        d3.select(filterRef.current).transition()
          .duration(50)
          .ease(d3.easeLinear)
          .attr("stdDeviation", '30')
      }, 2500)
      setTimeout(() => {
        d3.select(filterRef.current).transition()
          .duration(50)
          .ease(d3.easeLinear)
          .attr("stdDeviation", '0')
      }, 2950)
    }

    movingElement.current.transition()
    .duration(() => {
      if(length === 5){
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

    d3.select(gParentRef.current).transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr('fill', () => {
        return length === 5 ? '#2e3778' : "#cfedfc";
      })
    
    moon.current.transition()
      .duration(2500)
      .ease(d3.easeLinear) // Easing for the transform
      .attrTween('transform', (d, i, nodes) => translateAlongPath(d, i, nodes, 0, 0.5))
      .attr('fill', () => {
        return length === 5 ? '#2e3778' : "#cfedfc";
      })
      .on('end', () => {
        if(length === 5){
          setTimeout(() => {
            animateSecondHalf();
          }, 500)
        } else {
          animateSecondHalf();
        }
      });
  };
  
  const animateSecondHalf = () => {

    d3.select(filterRef.current).transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr("stdDeviation", '0')

    d3.select(gParentRef.current).transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr("fill", "#cfedfc")

    moon.current.transition()
      .duration(2500) // Remaining half duration
      .ease(d3.easeLinear)
      .attrTween('transform', (d, i, nodes) => translateAlongPath(d, i, nodes, 0.5, 1))
      .attr('fill', "#cfedfc")
      .on('end', animateCircle);
  };
  
  const translateAlongPath = (d, i, nodes, startPercent, endPercent) => {
    return (t) => {
      const scaledT = startPercent + (endPercent - startPercent) * t; // Scale t based on start and end percentages
      const path = moonPath.current.node();
      const l = path.getTotalLength();
      const p = path.getPointAtLength(scaledT * l);
  
      // Translate the circle to the new position
      return `translate(${p.x},${p.y})`;
    };
  };
  
  return(
    <g>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur ref={filterRef} stdDeviation="0" result="coloredBlur"/>
          <feComponentTransfer>
              <feFuncA type="linear" slope="1.5" />
              <feFuncR type="linear" slope="1.5" />
              <feFuncG type="linear" slope="1.5" />
              <feFuncB type="linear" slope="1.5" />
          </feComponentTransfer>
          <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect ref={gParentRef} width={"100%"} height={900} fill="#cfedfc" className="sky"></rect>
      {/* <circle cx="300" cy="300" r="175" fill="url(#grad1)" /> */}
      <g ref={gRef} transform={`translate(${wxh/2}, ${900/2})`}>
        <circle cx={'0px'} cy={'0px'} r={radius} fill="#fcd656" filter="url(#glow)"></circle>
      </g>
      <g ref={gTimelineRef} transform={`translate(0, 650)`}></g>
    </g>
  )
}

export default RenderCircle;