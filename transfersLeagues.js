import * as d3 from 'd3';
import {
  countries,
  fromCountryField,
  fromLeagueField,
  fromRegionField,
  toCountryField,
  toLeagueField,
  toRegionField
} from "./fields";
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

  let flagDX = 12;

  data.forEach(t => {
    if (fromLeaguesObj[t[fromLeagueField]]) {
      fromLeaguesObj[t[fromLeagueField]].count += 1;
    } else {
      fromLeaguesObj[t[fromLeagueField]] = {};
      fromLeaguesObj[t[fromLeagueField]].count = 1;
      fromLeaguesObj[t[fromLeagueField]].region = t[fromRegionField];
      fromLeaguesObj[t[fromLeagueField]].country = t[fromCountryField];
    }

    if (toLeaguesObj[t[toLeagueField]]) {
      toLeaguesObj[t[toLeagueField]].count += 1;
    } else {
      toLeaguesObj[t[toLeagueField]] = {};
      toLeaguesObj[t[toLeagueField]].count = 1;
      toLeaguesObj[t[toLeagueField]].region = t[toRegionField];
      toLeaguesObj[t[toLeagueField]].country = t[toCountryField];
    }
  });
  // console.log(fromLeaguesObj, toLeaguesObj);
  const fromData = Object.entries(fromLeaguesObj).sort((a, b) => b[1].count - a[1].count);
  let maxFrom = 0;
  if (fromData.length === 0) {
    maxFrom = 10;
  } else {
    maxFrom = fromData[0][1].count;
  }

  const toData = Object.entries(toLeaguesObj).sort((a, b) => b[1].count - a[1].count);
  let maxTo = 0;
  if (toData.length === 0) {
    maxTo = 10;
  } else {
    maxTo = toData[0][1].count;
  }
 

  // const wFromdY = fromData.length> 15 ? 10 : 20;
  const wFromdY = 18;
  const fromHeight = fromData.length * wFromdY + 32;

  // const wTodY = toData.length> 15 ? 10 : 20;
  const wTodY = 15;
  const toHeight = toData.length * wTodY + 32;

  if (document.getElementById('fromLeaguesSvg')) {
    d3.select("#fromLeaguesSvg").remove();
    svgFromElement = d3.select("#fromLeagues")
      .append("svg")
        .attr("id", 'fromLeaguesSvg')
        .attr("width", width - flagDX * 2)
        .attr("height", fromHeight)
        .attr("transform", `translate(${0}, ${0})`);
  } else {
    svgFromElement = d3.select("#fromLeagues")
      .append("svg")
        .attr("id", 'fromLeaguesSvg')
        .attr("width", width - flagDX * 2)
        .attr("height", fromHeight)
        .attr("transform", `translate(${0}, ${0})`);
  }

  if (document.getElementById('toLeaguesSvg')) {
    d3.select("#toLeaguesSvg").remove();
    svgToElement = d3.select("#toLeagues")
      .append("svg")
        .attr("id", 'toLeaguesSvg')
        .attr("width", width - flagDX * 2)
        .attr("height", toHeight)
        .attr("transform", `translate(${0}, ${0})`);
  } else {
    svgToElement = d3.select("#toLeagues")
      .append("svg")
        .attr("id", 'toLeaguesSvg')
        .attr("width", width - flagDX * 2)
        .attr("height", toHeight)
        .attr("transform", `translate(${0}, ${0})`);
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
  const ticks = [];
  const x = d3.scaleLinear()
    .domain([0, maxFrom])
    .range([0, width - 12 - flagDX * 2]);
  svgFrom.append("g")
    .attr("transform", `translate(${0}, ${fromHeight - 22})`)
    .attr("class", `domainX`)
    // .call(d3.axisBottom(x))
    .call(d3.axisBottom(x).tickFormat((d, i) => {  
      const n = Math.floor(d);
      if (i === 0) {
        return n;
      } else {
        if (n < 1) {
          return '';
        } else {
          if (ticks.includes(n)) {
            return '';
          }
          ticks.push(n);
          return n;
        }
      }
    }))
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
    .attr("x", x(0))
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
    .style("font-size", '12px')
    .attr("text-anchor", 'start');
  const nodes = svgFrom
    .selectAll("rect")
    .nodes();
  const flags = document.querySelectorAll('[data-flag-from]');
  flags.forEach(f => f.remove());
  
  nodes.forEach((n, i) => {
    // console.log(fromData[i]);
    const y = Number(n.getAttribute('y'));
    const span = document.createElement('span');
    span.dataset.flagFrom = true;
    span.textContent = countries[fromData[i][1].country];
    // if (wFromdY === 20) {
    //   span.classList.add('flagLarge');
    //   span.style.left = '-4px';
    // } else {
      span.classList.add('flag');
      span.style.left = '-15px';
    // }
    span.style.position = 'absolute';
    span.style.top = `${y}px`;
    fromLeaguesContainer.append(span);
  });

  }
  {
  const ticks = [];
  const x = d3.scaleLinear()
    .domain([0, maxTo])
    .range([0, width - 12 - flagDX * 2]);
  svgTo.append("g")
    .attr("transform", `translate(${0}, ${toHeight - 22})`)
    .attr("class", `domainX`)
    // .call(d3.axisBottom(x))
    .call(d3.axisBottom(x).tickFormat((d, i) => {  
      const n = Math.floor(d);
      if (i === 0) {
        return n;
      } else {
        if (n < 1) {
          return '';
        } else {
          if (ticks.includes(n)) {
            return '';
          }
          ticks.push(n);
          return n;
        }
      }
    }))
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
    .style("font-size", '12px')
    .attr("text-anchor", 'start');
   const nodes = svgTo
    .selectAll("rect")
    .nodes();
  const flags = document.querySelectorAll('[data-flag-to]');
  flags.forEach(f => f.remove());
  
  nodes.forEach((n, i) => {
    // console.log(toData[i]);
    const y = Number(n.getAttribute('y'));
    const span = document.createElement('span');
    span.dataset.flagTo = true;
    span.textContent = countries[toData[i][1].country];
    // if (wTodY === 20) {
    //   span.classList.add('flagLarge');
    //   span.style.left = '-4px';
    // } else {
      span.classList.add('flag');
      span.style.left = '-15px';
    // }
    span.style.position = 'absolute';
    span.style.top = `${y}px`;
    toLeaguesContainer.append(span);
  });
  }
}