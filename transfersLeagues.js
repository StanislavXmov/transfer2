import * as d3 from 'd3';
import { fromLeagueField, fromRegionField, toLeagueField } from "./fields";
import { colors } from './transfersPoints';

const fromLeguesContainer = document.getElementById('fromLegues');

const width = fromLeguesContainer.clientWidth;
const height = 700;

const svgElement = d3.select("#fromLegues")
  .append("svg")
    .attr("width", width)
    .attr("height", height);


export const setLeagues = (data) => {
  let svg = null;
  if (svgElement.select('#fromLeguesData')) {
    svgElement.select('#fromLeguesData').remove();
    svg = svgElement.append("g")
      .attr("id", 'fromLeguesData');
  } else {
    svg = svgElement.append("g")
      .attr("id", 'fromLeguesData');
  }

  console.log('setLeagues', data);
  const fromLeguesObj = {};
  const toLeguesObj = {};

  data.forEach(t => {
    if (fromLeguesObj[t[fromLeagueField]]) {
      fromLeguesObj[t[fromLeagueField]].count += 1;
    } else {
      fromLeguesObj[t[fromLeagueField]] = {};
      fromLeguesObj[t[fromLeagueField]].count = 1;
      fromLeguesObj[t[fromLeagueField]].region = t[fromRegionField];
    }

    if (toLeguesObj[t[toLeagueField]]) {
      toLeguesObj[t[toLeagueField]].count += 1;
    } else {
      toLeguesObj[t[toLeagueField]] = {};
      toLeguesObj[t[toLeagueField]].count = 1;
    }
  });
  console.log(fromLeguesObj, toLeguesObj);
  const fromData = Object.entries(fromLeguesObj).sort((a, b) => b[1].count - a[1].count);
  const maxFrom = fromData[0][1].count + 10;
  
  console.log(fromData, maxFrom);
  const x = d3.scaleLinear()
    .domain([0, maxFrom])
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(${0}, ${height - 22})`)
    .attr("class", `domainX`)
    .call(d3.axisBottom(x))
    .call(g => g.select(".domain").remove());

  svg.selectAll('.domainX')
    .selectAll("line").remove();

  const y = d3.scaleBand()
    .range([0, height - 22])
    .domain(fromData.map(d => d[0]))
    .padding(.1);
  svg.selectAll("rect")
    .data(fromData)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d[0]))
    .attr("width", d => x(d[1].count))
    .attr("height", y.bandwidth() )
    .attr("fill", d => colors[d[1].region]);

  svg.append("g")
    .attr("class", `domainY`)
    .attr("transform", `translate(${12}, 0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());
  svg.selectAll('.domainY')
    .selectAll("line").remove();
  svg.selectAll('.domainY')
    .selectAll("text")
    .attr("text-anchor", 'start');
}