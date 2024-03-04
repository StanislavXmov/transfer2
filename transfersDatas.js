import * as d3 from 'd3';
import {
  ageField,
  countries,
  fromLeagueField,
  fromRegionField,
  nationalityField,
  toLeagueField,
  toRegionField
} from "./fields";
import { colors } from './transfersPoints';

const ageDataContainer = document.getElementById('ageData');
const nationalityDataContainer = document.getElementById('nationalityData');

const width = ageDataContainer.clientWidth;
const widthTo = nationalityDataContainer.clientWidth;


export const setDatas = (data) => {
  let ageDataElement = null;
  let ageDataSvg = null;
  let nationalityDataElement = null;
  let nationalityDataSvg = null;

  const ageData = {};
  const nationalityData = {};

  let flagDX = 12;
  // const nationalitySet = new Set();

  data.forEach(t => {
    if (ageData[t[ageField]]) {
      ageData[t[ageField]].count += 1;
    } else {
      ageData[t[ageField]] = {};
      ageData[t[ageField]].count = 1;
    }
    if (nationalityData[t[nationalityField]]) {
      nationalityData[t[nationalityField]].count += 1;
    } else {
      nationalityData[t[nationalityField]] = {};
      nationalityData[t[nationalityField]].count = 1;
      // nationalitySet.add(t[nationalityField]);
    }
  });
  // console.log(nationalitySet);

  // console.log(Object.keys(nationalityData));
  const ageDataListSorted = Object.entries(ageData).sort((a, b) => b[1].count - a[1].count);
  const maxAge = ageDataListSorted[0][1].count;

  const nationalityDataList = Object.entries(nationalityData).sort((a, b) => b[1].count - a[1].count);
  const maxNationality = nationalityDataList[0][1].count;

  const wAgedY = ageDataListSorted.length> 15 ? 10 : 20;
  const ageHeight = ageDataListSorted.length * wAgedY + 32;

  const wNationalitydY = nationalityDataList.length> 15 ? 10 : 20;
  const nationalityHeight = nationalityDataList.length * wNationalitydY + 32;

  const ageDataList = Object.entries(ageData);

  // if (document.getElementById('ageDataSvg')) {
  //   d3.select("#ageDataSvg").remove();
  //   ageDataElement = d3.select("#ageData")
  //     .append("svg")
  //       .attr("id", 'ageDataSvg')
  //       .attr("width", width)
  //       .attr("height", ageHeight);
  // } else {
  //   ageDataElement = d3.select("#ageData")
  //     .append("svg")
  //       .attr("id", 'ageDataSvg')
  //       .attr("width", width)
  //       .attr("height", ageHeight);
  // }

  if (document.getElementById('nationalityDataSvg')) {
    d3.select("#nationalityDataSvg").remove();
    nationalityDataElement = d3.select("#nationalityData")
      .append("svg")
        .attr("id", 'nationalityDataSvg')
        .attr("width", width - flagDX * 2)
        .attr("height", nationalityHeight)
        .attr("transform", `translate(${flagDX}, ${0})`);
  } else {
    nationalityDataElement = d3.select("#nationalityData")
      .append("svg")
        .attr("id", 'nationalityDataSvg')
        .attr("width", width - flagDX * 2)
        .attr("height", nationalityHeight)
        .attr("transform", `translate(${flagDX}, ${0})`);
  }

  // if (document.getElementById('ageDataWrapper')) {
  //   ageDataElement.select('#ageDataWrapper').remove();
  //   ageDataSvg = ageDataElement.append("g")
  //     .attr("transform", `translate(${12}, ${0})`)
  //     .attr("id", 'ageDataWrapper');
  // } else {
  //   ageDataSvg = ageDataElement.append("g")
  //     .attr("transform", `translate(${12}, ${0})`)
  //     .attr("id", 'ageDataWrapper');
  // }

  if (document.getElementById('nationalityDataWrapper')) {
    nationalityDataElement.select('#nationalityDataWrapper').remove();
    nationalityDataSvg = nationalityDataElement.append("g")
      .attr("transform", `translate(${2}, ${0})`)
      .attr("id", 'nationalityDataWrapper');
  } else {
    nationalityDataSvg = nationalityDataElement.append("g")
      .attr("transform", `translate(${2}, ${0})`)
      .attr("id", 'nationalityDataWrapper');
  }

  // {
  //   const x = d3.scaleLinear()
  //     .domain([0, maxAge])
  //     .range([0, width - 12 - 42]);
  //   ageDataSvg.append("g")
  //     .attr("transform", `translate(${0}, ${ageHeight - 22})`)
  //     .attr("class", `domainX`)
  //     .call(d3.axisBottom(x))
  //     .call(g => g.select(".domain").remove());
  
  //   ageDataSvg.selectAll('.domainX')
  //     .selectAll("line").remove();
  
  //   const y = d3.scaleBand()
  //     .range([0, ageHeight - 22])
  //     .domain(ageDataList.map(d => d[0]))
  //     .padding(.1);
  //   ageDataSvg.selectAll("rect")
  //     .data(ageDataList)
  //     .enter()
  //     .append("rect")
  //     .attr("x", x(0) )
  //     .attr("y", d => y(d[0]))
  //     .attr("width", d => x(d[1].count))
  //     .attr("height", y.bandwidth() )
  //     .attr("fill", '#3470A4');
  
  //   ageDataSvg.append("g")
  //     .attr("class", `domainY`)
  //     .attr("transform", `translate(${6}, 0)`)
  //     .call(d3.axisLeft(y))
  //     .call(g => g.select(".domain").remove());
  //   ageDataSvg.selectAll('.domainY')
  //     .selectAll("line").remove();
  //   ageDataSvg.selectAll('.domainY')
  //     .selectAll("text")
  //     // .attr("text-anchor", 'start');
  // }
  {
    const x = d3.scaleLinear()
      .domain([0, maxNationality])
      .range([0, width - 12 - flagDX * 2]);
    nationalityDataSvg.append("g")
      .attr("transform", `translate(${0}, ${nationalityHeight - 22})`)
      .attr("class", `domainX`)
      .call(d3.axisBottom(x))
      .call(g => g.select(".domain").remove());
  
    nationalityDataSvg.selectAll('.domainX')
      .selectAll("line").remove();
  
    const y = d3.scaleBand()
      .range([0, nationalityHeight - 22])
      .domain(nationalityDataList.map(d => d[0]))
      .padding(.1);
    nationalityDataSvg.selectAll("rect")
      .data(nationalityDataList)
      .enter()
      .append("rect")
      .attr("x", x(0) )
      .attr("y", d => y(d[0]))
      .attr("width", d => x(d[1].count))
      .attr("height", y.bandwidth() )
      .attr("fill", '#a6faa1');
  
    nationalityDataSvg.append("g")
      .attr("class", `domainY`)
      .attr("transform", `translate(${12}, 0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove());
    nationalityDataSvg.selectAll('.domainY')
      .selectAll("line").remove();
    nationalityDataSvg.selectAll('.domainY')
      .selectAll("text")
      .attr("text-anchor", 'start');

    const nodes = nationalityDataSvg
      .selectAll("rect")
      .nodes();
    const flags = document.querySelectorAll('[data-flag-nationality]');
    flags.forEach(f => f.remove());
    
    nodes.forEach((n, i) => {
      // console.log(fromData[i]);
      const y = Number(n.getAttribute('y'));
      const span = document.createElement('span');
      span.dataset.flagNationality = true;
      span.textContent = countries[nationalityDataList[i][0]];
      if (wNationalitydY === 20) {
        span.classList.add('flagLarge');
        span.style.left = '-4px';
      } else {
        span.classList.add('flag');
        span.style.left = '0px';
      }
      span.style.position = 'absolute';
      span.style.top = `${y}px`;
      nationalityDataContainer.append(span);
    });
  
  }

}