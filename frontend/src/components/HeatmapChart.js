import React, { useEffect } from 'react';
import * as d3 from 'd3';

const HeatmapChart = ({ gpsData }) => {
  useEffect(() => {
    const createChart = () => {
      d3.select('#hchart').selectAll('*').remove();

      const margin = { top: 10, right: 10, bottom: 30, left: 40 };
      const width = 500 - margin.right;
      const height = 320 - margin.top - margin.bottom;

      const svg = d3
        .select('#hchart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xScale = d3
        .scaleLinear()
        .domain([0, 8])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([-7, 7])
        .range([height, 0]);

      const colorScale = d3
        .scaleSequential(d3.interpolateBlues) // Use a color scale of your choice
        .domain([0, d3.max(gpsData, (d) => d.elapsedTime)]);

      svg
        .selectAll('rect')
        .data(gpsData)
        .enter()
        .append('rect')
        .attr('x', (gps) => xScale(gps.longitude))
        .attr('y', (gps) => yScale(gps.latitude))
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'white')
        .attr('stroke', 'white')
        .attr('opacity', 0.7)
        .append('title')
        .text((gps, index) => `Point ${index + 1}: Latitude: ${gps.latitude}, Longitude: ${gps.longitude}, Elapsed Time: ${gps.elapsedTime}`);

      // Add background parallel lines between the points
      const yTicks = d3.range(9);
      const lines = svg
        .selectAll('.parallel-line')
        .data(yTicks.slice(0, -1))
        .enter()
        .append('line')
        .attr('class', 'parallel-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => yScale(d))
        .attr('y2', (d) => yScale(d))
        .style('stroke', 'white')
        .style('stroke-opacity', 0.1);

      const lastLine = svg
        .append('line')
        .attr('class', 'parallel-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(yTicks[yTicks.length - 1]))
        .attr('y2', yScale(yTicks[yTicks.length - 1]))
        .style('stroke', 'white')
        .style('stroke-opacity', 0.1);

      lines.lower(); // Move the lines behind the points
    };

    createChart();
  }, [gpsData]);

  return <div id="hchart"></div>;
};

export default HeatmapChart;