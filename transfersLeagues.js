import * as d3 from 'd3';
import { fromLeagueField, fromRegionField, toLeagueField, toRegionField } from "./fields";
import { colors } from './transfersPoints';

const fromLeaguesContainer = document.getElementById('fromLeagues');
const toLeaguesContainer = document.getElementById('toLeagues');

const width = fromLeaguesContainer.clientWidth;
const widthTo = toLeaguesContainer.clientWidth;
// const height = 700;

// console.log(width, widthTo);

export const setLeagues = (data) => {
  let svgFromElement = null;
  let svgFrom = null;
  let svgToElement = null;
  let svgTo = null;

  // console.log('setLeagues', data);
  const fromLeaguesObj = {};
  const toLeaguesObj = {};

  data.forEach(t => {
    if (fromLeaguesObj[t[fromLeagueField]]) {
      fromLeaguesObj[t[fromLeagueField]].count += 1;
    } else {
      fromLeaguesObj[t[fromLeagueField]] = {};
      fromLeaguesObj[t[fromLeagueField]].count = 1;
      fromLeaguesObj[t[fromLeagueField]].region = t[fromRegionField];
    }

    if (toLeaguesObj[t[toLeagueField]]) {
      toLeaguesObj[t[toLeagueField]].count += 1;
    } else {
      toLeaguesObj[t[toLeagueField]] = {};
      toLeaguesObj[t[toLeagueField]].count = 1;
      toLeaguesObj[t[toLeagueField]].region = t[toRegionField];
    }
  });
  // console.log(fromLeaguesObj, toLeaguesObj);
  const fromData = Object.entries(fromLeaguesObj).sort((a, b) => b[1].count - a[1].count);
  const maxFrom = fromData[0][1].count;

  const toData = Object.entries(toLeaguesObj).sort((a, b) => b[1].count - a[1].count);
  const maxTo = toData[0][1].count;

  const wFromdY = fromData.length> 15 ? 10 : 20;
  const fromHeight = fromData.length * wFromdY + 32;

  const wTodY = toData.length> 15 ? 10 : 20;
  const toHeight = toData.length * wTodY + 32;

  if (document.getElementById('fromLeaguesSvg')) {
    d3.select("#fromLeaguesSvg").remove();
    svgFromElement = d3.select("#fromLeagues")
      .append("svg")
        .attr("id", 'fromLeaguesSvg')
        .attr("width", width)
        .attr("height", fromHeight);
  } else {
    svgFromElement = d3.select("#fromLeagues")
      .append("svg")
        .attr("id", 'fromLeaguesSvg')
        .attr("width", width)
        .attr("height", fromHeight);
  }

  if (document.getElementById('toLeaguesSvg')) {
    d3.select("#toLeaguesSvg").remove();
    svgToElement = d3.select("#toLeagues")
      .append("svg")
        .attr("id", 'toLeaguesSvg')
        .attr("width", width)
        .attr("height", toHeight);
  } else {
    svgToElement = d3.select("#toLeagues")
      .append("svg")
        .attr("id", 'toLeaguesSvg')
        .attr("width", width)
        .attr("height", toHeight);
  }

  if (document.getElementById('fromLeaguesData')) {
    svgFromElement.select('#fromLeaguesData').remove();
    svgFrom = svgFromElement.append("g")
      .attr("transform", `translate(${2}, ${0})`)
      .attr("id", 'fromLeaguesData');
  } else {
    svgFrom = svgFromElement.append("g")
      .attr("transform", `translate(${2}, ${0})`)
      .attr("id", 'fromLeaguesData');
  }

  if (document.getElementById('toLeaguesData')) {
    svgToElement.select('#toLeaguesData').remove();
    svgTo = svgToElement.append("g")
      .attr("transform", `translate(${2}, ${0})`)
      .attr("id", 'toLeaguesData');
  } else {
    svgTo = svgToElement.append("g")
      .attr("transform", `translate(${2}, ${0})`)
      .attr("id", 'toLeaguesData');
  }
  {
  const x = d3.scaleLinear()
    .domain([0, maxFrom])
    .range([0, width - 12]);
  svgFrom.append("g")
    .attr("transform", `translate(${0}, ${fromHeight - 22})`)
    .attr("class", `domainX`)
    .call(d3.axisBottom(x))
    .call(g => g.select(".domain").remove());

  svgFrom.selectAll('.domainX')
    .selectAll("line").remove();

  const y = d3.scaleBand()
    .range([0, fromHeight - 22])
    .domain(fromData.map(d => d[0]))
    .padding(.1);
  svgFrom.selectAll("rect")
    .data(fromData)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d[0]))
    .attr("width", d => x(d[1].count))
    .attr("height", y.bandwidth() )
    .attr("fill", d => colors[d[1].region]);

  svgFrom.append("g")
    .attr("class", `domainY`)
    .attr("transform", `translate(${12}, 0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());
  svgFrom.selectAll('.domainY')
    .selectAll("line").remove();
  svgFrom.selectAll('.domainY')
    .selectAll("text")
    .attr("text-anchor", 'start');
  }
  {
  const x = d3.scaleLinear()
    .domain([0, maxTo])
    .range([0, width - 12]);
  svgTo.append("g")
    .attr("transform", `translate(${0}, ${toHeight - 22})`)
    .attr("class", `domainX`)
    .call(d3.axisBottom(x))
    .call(g => g.select(".domain").remove());

  svgTo.selectAll('.domainX')
    .selectAll("line").remove();

  const y = d3.scaleBand()
    .range([0, toHeight - 22])
    .domain(toData.map(d => d[0]))
    .padding(.1);
  svgTo.selectAll("rect")
    .data(toData)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d[0]))
    .attr("width", d => x(d[1].count))
    .attr("height", y.bandwidth() )
    .attr("fill", d => colors[d[1].region]);

  svgTo.append("g")
    .attr("class", `domainY`)
    .attr("transform", `translate(${12}, 0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove());
  svgTo.selectAll('.domainY')
    .selectAll("line").remove();
  svgTo.selectAll('.domainY')
    .selectAll("text")
    .attr("text-anchor", 'start');
  }
}