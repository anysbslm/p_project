import React, { useEffect } from 'react';
import * as d3 from 'd3';

const GPSChart = ({ gpsData }) => {
    useEffect(() => {
      const createChart = () => {
        d3.select('#chart').selectAll('*').remove();
  
        const margin = { top: 10, right: 10, bottom: 30, left: 40 };
        const width = 340;
        const height = 300 - margin.top - margin.bottom;
  
        const svg = d3
          .select('#chart')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`)

        const xScale = d3
        // map values from a domain to a range
          .scaleLinear()
          .domain([0, 8]) 
          .range([0, width]);
  
        const yScale = d3
          .scaleLinear()
          .domain([-7, 7])
          .range([height, 0]);
  
        //x-axis
        // svg.append('g')
        //    .attr('transform', `translate(0,${height/2})`)
        //    .call(d3.axisBottom(xScale))
        //    .selectAll('path, line')
        //    .style('stroke', 'white');
        //    svg.append('text')
        //    .attr('x', width)
        //    .attr('y', height /1.6)
        //    .attr('text-anchor', 'end')
        //    .attr('fill', 'white')
        //    .text('Longitude');   
  
        // // y-axis
        // svg.append('g')
        //    .call(d3.axisLeft(yScale)
        //    .tickSize(-width)
        //    .tickPadding(10))
        //    .selectAll('path, line')
        //    .style('stroke', 'white')
        // // precision lines
        //    .style('opacity', 0.01);
        
        // point to point 
        const line = d3
          .line()
          .x((gps) => xScale(gps.longitude))
          .y((gps) => yScale(gps.latitude));
  
        // line
        svg
          .append('path')
          // associate single data from the gpsData array.
          .datum(gpsData)
          .attr('d', line)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 3)


        svg
          .selectAll('circle')
          .data(gpsData)
          .enter()
          .append('circle')
          .attr('cx', (gps) => xScale(gps.longitude))
          .attr('cy', (gps) => yScale(gps.latitude))
          .attr('r', 6)
          .attr('fill', (gps, index) => {
            if (index === 0) {
              return 'white'; 
            } else if (index === gpsData.length - 1) {
              return 'red'; 
            } else {
              return 'steelblue'; 
            }
          })
          .append('title')
          .text((gps, index) => `Point ${index + 1}: Latitude: ${gps.latitude}, Longitude: ${gps.longitude}, Elapsed Time: ${gps.elapsedTime}`);
          
        svg
          .selectAll('text')
          .data(gpsData)
          .enter()
          .append('text')
          .attr('x', (gps) => xScale(gps.longitude) + 5)
          .attr('y', (gps) => yScale(gps.latitude))
        //   .text((_, index) => index + 1)
          .attr('fill', 'white');
      
          svg
          .append('text')
          .attr('x', width / 4.5)
          .attr('y', margin.top / 2)
          .attr('text-anchor', 'middle')
          // .text('Route')
          .style('font-weight', 'bold')
          .attr('fill', 'white')
        
      
        };
  
      createChart();
    }, [gpsData]);
  
    return <div id="chart"></div>;
  };


export default GPSChart;
