import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BreakDown = ({ gpsData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Calculate distance using the Haversine formula
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
  

    // Calculate the breakdown for each 5-minute interval
    const calculateBreakdown = () => {
        const breakdown = [];
      
        let totalElapsedTime = 0;
        let totalDistance = 0;
      
        for (let i = 0; i < gpsData.length - 1; i++) {
          const currentPoint = gpsData[i];
          const nextPoint = gpsData[i + 1];
          const segmentDistance = calculateDistance(
            currentPoint.latitude,
            currentPoint.longitude,
            nextPoint.latitude,
            nextPoint.longitude
          );
      
          totalDistance += segmentDistance;
          totalElapsedTime += parseFloat(currentPoint.elapsedTime);
      
          if (totalElapsedTime >= 5) {
            breakdown.push({
              elapsedTime: totalElapsedTime,
              distance: totalDistance,
            });
      
            totalElapsedTime = 0;
            totalDistance = 0;
          }
        }
      
        // Include the remaining data if applicable
        if (totalElapsedTime > 0) {
          breakdown.push({
            elapsedTime: totalElapsedTime,
            distance: totalDistance,
          });
        }
      
        return breakdown;
      };
      
    // Calculate the average speed
    const calculateAverageSpeed = (breakdown) => {
      const totalElapsedTime = breakdown.reduce(
        (total, interval) => total + interval.elapsedTime,
         0
      );
      const totalDistance = breakdown.reduce(
        (total, interval) => total + interval.distance,
        0
      );

      const averageSpeed = totalDistance / (totalElapsedTime / breakdown.length);
      return averageSpeed;
    };

    // Generate the bar chart
    const generateBarChart = () => {
      const breakdown = calculateBreakdown();
      const averageSpeed = calculateAverageSpeed(breakdown);

      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      // Create the SVG container
      const svg = d3
        .select(chartRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Define the x-axis scale
      const xScale = d3
        .scaleBand()
        .domain(breakdown.map((d, i) => i + 1))
        .range([0, width])
        .padding(0.4)
        
      // Define the y-axis scale
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(breakdown, (d) => d.distance)])
        .range([height, 0]);

      // Create the x-axis
      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale)).style('color','white');

      // Create the y-axis
      svg.append('g').call(d3.axisLeft(yScale)).style('color','white');


      // Create the bars
  svg
  .selectAll('rect')
  .data(breakdown)
  .enter()
  .append('rect')
  .attr('x', (d, i) => xScale(i + 1))
  .attr('y', (d) => yScale(d.distance))
  .attr('width', xScale.bandwidth())
  .attr('height', (d) => height - yScale(d.distance))
  .attr('fill', 'steelblue');

// Add chart title
svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', -margin.top / 2)
  .attr('text-anchor', 'middle')
  .text('Total Distance Breakdown')
  .style('font-weight', 'bold')
  .attr('fill', 'white')

// Add total distance text
svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', height + margin.bottom)
  .attr('text-anchor', 'middle')
  // .text(`Total Distance: ${d3.sum(breakdown, (d) => d.distance).toFixed(2)} Km.`)
  .attr('fill','white');

// Add average speed text
svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', height + margin.bottom + 20)
  .attr('text-anchor', 'middle')
  .text(`Average Speed: ${averageSpeed.toFixed(2)} km/h`);

};

// Call the function to generate the chart
generateBarChart();

// Clean up the chart on component unmount
return () => {
d3.select(chartRef.current).selectAll('svg').remove();
};
}, [gpsData]);

return <div ref={chartRef} />;
};

export default BreakDown;

