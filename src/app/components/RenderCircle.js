"use client"
import * as d3 from 'd3'
import overlap from '../output.json';
import { useEffect, useRef } from 'react';

const RenderCircle = ({ beginVertexAngle, endVertexAngle, midVertexAngle, obscuration }) => {
  let r = 100;
  let lineData = [
    [],
    [],
    []
  ];

  const gRef = useRef();
  let moon;
  let moonPath;

  useEffect(() => {
    drawCircles();
  }, []);

  const drawCircles = () => {
    const g = d3.select(gRef.current);
    // x = r * sin(-i),  y = r * cos(-i)
    [...Array(360).keys()].forEach(i => {
      let color = "";
      let angle = (i - 270) * Math.PI / 180; // Convert degrees to radians and offset by 90 degrees
      let cx = r * Math.cos(-angle);
      let cy = r * Math.sin(-angle);

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
         .attr('r', 2)
         .attr('i', i)
         .attr('fill', color)
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
      .attr('stroke', 'red')
      .attr('fill', 'none');
    
    moon = g.append('circle')
      // .attr('cx', lineData[0][0])
      // .attr('cy', lineData[0][1])
      .attr('r', 100)
      .attr('fill', 'pink');
    
    animateCircle();
  };

  const animateCircle = () => {
    // Select the circle element

    // const circle = d3.select(circleRef.current);
    // console.log(circle)

    // Use D3 transition to animate the circle along the path
    moon.transition()
      .duration(5000) // Duration of the animation (in milliseconds)
      .attrTween('transform', translateAlongPath)
      .on('end', animateCircle); // Restart the animation when it ends
  };

  const translateAlongPath = () => {
    return (t) => {
      // Get the current position along the path
      const path = moonPath.node();
      const l = path.getTotalLength();
      const p = path.getPointAtLength(t * l);
      // console.log(path)

      // Translate the circle to the new position
      return `translate(${p.x},${p.y})`;
    };
  };

  return(
    <g ref={gRef} transform="translate(300, 300)">
      <circle cx={'0px'} cy={'0px'} r={r} fill="blue"></circle>
    </g>
    
  )
}

export default RenderCircle;