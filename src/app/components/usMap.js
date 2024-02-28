// import overlap from '../states_data.json';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
// import overlap from '../states_data.json';
import usGeo from '../data/usgeo.json';
// ../data/cut2.json
import geojsonPathData from '../data/ppath.json'; // Import your GeoJSON path data file

const USMap = ({ currentLocation }) => {
    const svgRef = useRef();
    const svgContainerRef = useRef(); // Ref for the SVG container
    const pointRef = useRef(); // Ref for the point element

    const width = 700;
    const height = 500;

    // Create projection
    const projection = d3.geoAlbersUsa()
    .scale(1000) // Adjust scale as needed
    .translate([width / 2, height / 2]);

    // Create path generator
    const path = d3.geoPath().projection(projection);

    useEffect(() => {
        // Create SVG element
        const svg = d3.select(svgRef.current)
            .attr("id", "usMap")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .selectAll("path")
            .data(usGeo.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "lightgray")
            .attr("stroke", "white");

        // Render GeoJSON path
        svg.append("g")
            .selectAll("path")
            .data(geojsonPathData.features) // Use your GeoJSON path data
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "steelblue")
            .attr("opacity", d => {
              console.log(d.properties['Obscuratio'])
              return parseFloat(d.properties['Obscuratio']);
            })
            .attr("stroke", "white");

        // Save SVG container reference
        svgContainerRef.current = svg;

    }, []);

    useEffect(() => {

      if (pointRef.current) {
          pointRef.current.remove();
      }
      console.log(currentLocation)
      const pointFeature = {
          type: "Feature",
          geometry: {
              type: "Point",
              coordinates: currentLocation
          }
      };

      const svgContainer = svgContainerRef.current;

      const point = svgContainer.append("path")
          .datum(pointFeature)
          .attr("d", path)
          .attr("fill", "red"); // Adjust color as needed
      
      // Update pointRef to the new point
      pointRef.current = point.node();

  }, [currentLocation]);

    return (
        <svg ref={svgRef}></svg>
    );
}

export default USMap;
