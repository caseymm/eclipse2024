"use client"
import * as d3 from 'd3'
import overlap from '../output.json';
import { useEffect, useState, useRef } from 'react';

const RenderCircle = ({ data, obscuration, radius, wxh, currentTime }) => {
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
  let moon;
  let moonPath;

  useEffect(() => {
    drawCircles();
  }, [data, obscuration, currentTime]);

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
    moonPath = g.append('path')
      .datum(lineData) // Bind the data
      .attr('d', line) // Use the line generator
      // .attr('stroke', 'red')
      .attr('fill', 'none');
    
    moon = g.append('circle')
      // .attr('cx', lineData[0][0])
      // .attr('cy', lineData[0][1])
      .attr('r', radius)
      .attr('fill', 'pink')
      .classed('moon', true);
    
    animateCircle();
  };

  const animateCircle = () => {
    moon.transition()
      .duration(10) 
      .attrTween('transform', translateAlongPath)
      .ease(d3.easeLinear)
      .on('end', animateCircle);
  };

  const translateAlongPath = () => {
    return (t) => {
      const path = moonPath.node();
      const l = path.getTotalLength();
      const p = path.getPointAtLength(currentTime * l);
      return `translate(${p.x},${p.y})`;
    };
  };

  return(
    <g ref={gRef} transform={`translate(${wxh/2}, ${wxh/2})`}>
      <circle cx={'0px'} cy={'0px'} r={radius} fill="blue"></circle>
    </g>
  )
}

export default RenderCircle;