import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DistanceVisualization = ({ gpsData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 500;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const distances = [];
    const elapsedTimes = [];

    for (let i = 0; i < gpsData.length - 1; i++) {
      const currentPoint = gpsData[i];
      const nextPoint = gpsData[i + 1];
      const segmentDistance = calculateDistance(
        currentPoint.latitude,
        currentPoint.longitude,
        nextPoint.latitude,
        nextPoint.longitude
      );
      const elapsedTime = parseFloat(currentPoint.elapsedTime);
      distances.push(segmentDistance);
      elapsedTimes.push(elapsedTime);
    }

    const xScale = d3.scaleLinear()
      .domain([0, distances.length - 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(distances)])
      .range([innerHeight, 0]);

    const line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

    svg.attr('width', width)
      .attr('height', height);
      
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
      
      g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'Bold')
      .style('fill', 'white')
      .text('Distances between Consecutive Points');
    

    g.append('path')
      .datum(distances)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style('color','white');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .style('color','white');

  }, [gpsData]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };
  const deg2rad = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  return (
    <div id="distance-visualization">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DistanceVisualization;
