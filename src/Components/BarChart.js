import React, { useEffect, useRef, useState } from 'react';

import { select, scaleLinear, axisBottom, axisRight, scaleBand } from "d3";


const useResizeObserver = (ref) => {
    const [dimensions, setDimensions] = useState(null);
    useEffect( () => {
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach( entry => {
                setDimensions(entry.contentRect);
            });
            // set the resized dimensions here later
        });
        
        resizeObserver.observe(observeTarget)
        return () => {
            resizeObserver.unobserve(observeTarget)
        }
    }, [ref])
    
    return dimensions;
};

const BarChart = () => {

  const [data, setData] = useState([25, 30, 54, 12, 123, 44, 60, 121])
  const svgRef = useRef();
  const svgWrapperRef = useRef();

  const dimensions = useResizeObserver(svgWrapperRef)

  useEffect(() => {
    const svg = select(svgRef.current);
    
    console.log(dimensions)

    if(!dimensions) return;

    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, dimensions.width])
      .padding(0.5)

    const yScale = scaleLinear()
      .domain([0, 200])
      .range([dimensions.height, 0])
    
    const colorScale = scaleLinear()
      .domain([0, 100, 200])
      .range(['green', 'orange', 'red'])
    
    const xAxis = axisBottom(xScale).ticks(data.length)
    svg.select('.x-axis')
      .style('transform', `translateY(${dimensions.height}px)`)
      .call(xAxis)

    const yAxis = axisRight(yScale)
    svg.select('.y-axis')
      .style('transform', `translateX(${dimensions.width}px)`)
      .call(yAxis)

    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .style('transform', 'scale(1, -1)')
      .attr('x', (value, index) => xScale(index))
      .attr('y', -dimensions.height)
      .attr('width', xScale.bandwidth())
      .on('mouseenter', (value, index) => {
        svg.selectAll('.tooltip')
          .data([value])
          .join(enter => enter.append('text').attr('y', yScale(value) + 8))
          .attr('class', 'tooltip')
          .text(value)
          .attr('x', xScale(index) + xScale.bandwidth() / 2 )
          .attr('text-anchor', 'middle')
          .transition()
          .attr('y', yScale(value + 4))
          .attr('opacity', 1)
      })
      .on('mouseleave', () => svg.select('.tooltip').remove())
      .transition()
      .attr('fill', colorScale)
      .attr('height', value => dimensions.height - yScale(value) )

  }, [data, dimensions]);

  return (
    <React.Fragment>
        <div ref={svgWrapperRef}>
            <svg ref={svgRef}>
                <g className='x-axis'></g>
                <g className='y-axis'></g>
            </svg>
        </div>
        

        <div className='chart_controls'>
            <button onClick={(v) => { setData(data.map(v => v - 5)); console.log(data) }}>
            Decrease
            </button>
            <button onClick={(v) => { setData(data.map(v => v + 5)); console.log(data) }}>
            Increase
            </button>

            <button onClick={(v) => { setData(data.slice(1, data.length - 1)); console.log(data) }}>
            Remove Value
            </button>
            <button onClick={(v) => { setData(data.concat([Math.floor(Math.random() * 201)])); console.log(data) }}>
            Add Value
            </button>
        </div>

    </React.Fragment>
  );
}

export default BarChart;
