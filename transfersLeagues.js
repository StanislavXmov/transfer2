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
import { colors, setPointsOpacity, setPointsOpacityByFiltered } from './transfersPoints';
import { chacheLeaguesFilter, leaguesFilter, data as fullData } from './main';
import { setDatas } from './transfersDatas';
import { setTreeMap } from './transfersTreemap';

const transfersDataContainer = document.getElementById('transfersData');
const fromLeaguesContainer = document.getElementById('fromLeagues');
const toLeaguesContainer = document.getElementById('toLeagues');

const width = fromLeaguesContainer.clientWidth;
const widthTo = toLeaguesContainer.clientWidth;
// const height = 700;

// console.log(width, widthTo);

const filteredByTo = (data, to) => {
  let filtered = data.filter(d => d[toLeagueField] === to);
  return filtered;
}

const filteredByFrom = (data, from) => {
  let filtered = data.filter(d => d[fromLeagueField] === from);
  return filtered;
}

const filteredByLeagues = (data) => {
  let filtered = [];
  if (leaguesFilter.from && leaguesFilter.to) {
    filtered = data.filter(d => d[fromLeagueField] === leaguesFilter.from && d[toLeagueField] === leaguesFilter.to);
  } else if (leaguesFilter.from && !leaguesFilter.to) {
    filtered = data.filter(d => d[fromLeagueField] === leaguesFilter.from);
  } else if (!leaguesFilter.from && leaguesFilter.to) {
    filtered = data.filter(d => d[toLeagueField] === leaguesFilter.to);
  }
  return filtered;
}

export const setLeaguesOpacity = (v) => {
  d3.selectAll(`[data-rect-from-league]`)
  .style("opacity", v);
  d3.selectAll(`[data-rect-from-league-added]`)
  .style("opacity", v);
  d3.selectAll(`[data-text-from-league]`)
  .style("opacity", v);
  d3.selectAll(`[data-flag-from-league]`)
  .style("opacity", v);
  d3.selectAll(`[data-rect-to-league]`)
  .style("opacity", v);
  d3.selectAll(`[data-rect-to-league-added]`)
  .style("opacity", v);
  d3.selectAll(`[data-text-to-league]`)
  .style("opacity", v);
  d3.selectAll(`[data-flag-to-league]`)
  .style("opacity", v);
}

export const setLeaguesOpacityByTransfer = (t) => {
  if (leaguesFilter.to) {
    d3.selectAll(`[data-rect-from-league-added="${t[fromLeagueField]}"]`)
      .style("opacity", 1);
  } else {
    d3.selectAll(`[data-rect-from-league="${t[fromLeagueField]}"]`)
      .style("opacity", 1);
  }
  d3.selectAll(`[data-text-from-league="${t[fromLeagueField]}"]`)
    .style("opacity", 1);
  d3.selectAll(`[data-flag-from-league="${t[fromLeagueField]}"]`)
    .style("opacity", 1);
  if (leaguesFilter.from) {
    d3.selectAll(`[data-rect-to-league-added="${t[toLeagueField]}"]`)
      .style("opacity", 1);
  } else {
    d3.selectAll(`[data-rect-to-league="${t[toLeagueField]}"]`)
      .style("opacity", 1);
  }
  d3.selectAll(`[data-text-to-league="${t[toLeagueField]}"]`)
    .style("opacity", 1);
  d3.selectAll(`[data-flag-to-league="${t[toLeagueField]}"]`)
    .style("opacity", 1);
}

export const setLeaguesOpacityByFrom = (from, v) => {
  d3.selectAll(`[data-rect-from-league="${from}"]`)
    .style("opacity", v);
  d3.selectAll(`[data-text-from-league="${from}"]`)
    .style("opacity", v);
  d3.selectAll(`[data-flag-from-league="${from}"]`)
    .style("opacity", v);
}

export const setLeaguesOpacityByTo = (to, v) => {
  d3.selectAll(`[data-rect-to-league="${to}"]`)
    .style("opacity", v);
  d3.selectAll(`[data-text-to-league="${to}"]`)
    .style("opacity", v);
  d3.selectAll(`[data-flag-to-league="${to}"]`)
    .style("opacity", v);
}

export const setLeaguesOpacityByLeagues = (data) => {
  if (leaguesFilter.from) {
    setLeaguesOpacityByFrom(leaguesFilter.from, 1);
  }
  if (leaguesFilter.to) {
    setLeaguesOpacityByTo(leaguesFilter.to, 1);
  }
  
  setPointsOpacity(0.1);
  const f = filteredByLeagues(data);
  setPointsOpacityByFiltered(f);

  if (!leaguesFilter.to && !leaguesFilter.from) {
    setLeaguesOpacity(1);
    setPointsOpacity(1);
  }
}

let _toDataState = [];
let _fromDataState = [];

export const returnLeguesToState = () => {
  _toDataState.forEach(d => {
    setLeaguesOpacityByTo(d[0], 1);
    d3.selectAll(`[data-rect-to-league="${d[0]}"]`)
      .style("opacity", 0.4);
    d3.selectAll(`[data-rect-to-league-added="${d[0]}"]`)
      .style("opacity", 1);
  });
}

export const returnLeguesFromState = () => {
  _fromDataState.forEach(d => {
    setLeaguesOpacityByFrom(d[0], 1);
    d3.selectAll(`[data-rect-from-league="${d[0]}"]`)
      .style("opacity", 0.4);
    d3.selectAll(`[data-rect-from-league-added="${d[0]}"]`)
      .style("opacity", 1);
  });
}

export const setLeagues = (data) => {
  let svgFromElement = null;
  let svgFrom = null;
  let svgToElement = null;
  let svgTo = null;

  const TO = {};
  const FROM = {};

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
  _fromDataState = fromData;
  let maxFrom = 0;
  if (fromData.length === 0) {
    maxFrom = 10;
  } else {
    maxFrom = fromData[0][1].count;
  }

  let scrollFrom = fromData.length > 14;

  const toData = Object.entries(toLeaguesObj).sort((a, b) => b[1].count - a[1].count);
  _toDataState = toData;
  let maxTo = 0;
  if (toData.length === 0) {
    maxTo = 10;
  } else {
    maxTo = toData[0][1].count;
  }

  let scrollTo = toData.length > 14;

  if (scrollFrom || scrollTo) {
    transfersDataContainer.style.height = '760px';
  } else {
    transfersDataContainer.style.height = '780px';
  }
 

  // const wFromdY = fromData.length> 15 ? 10 : 20;
  const wFromdY = 18;
  const fromHeight = fromData.length * wFromdY + 32;

  // const wTodY = toData.length> 15 ? 10 : 20;
  const wTodY = 18;
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
  // FROM
  {
  const ticks = [];
  const x = d3.scaleLinear()
    .domain([0, maxFrom])
    .range([0, width - 12 - flagDX * 2]);
  FROM.x = x;
  if (!scrollFrom) {
    d3.select("#fromLeaguesAddedAxisSvg").remove();
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
  } else {
    d3.select("#fromLeaguesAddedAxisSvg").remove();
    const fromLeaguesAddedAxisSvg = d3.select("#transfersDataWrapper")
      .append('svg')
        .attr("id", 'fromLeaguesAddedAxisSvg')
        .attr("width", width - 12)
        .attr("height", 20)
        .attr("transform", `translate(${0}, ${0})`);

    fromLeaguesAddedAxisSvg.append("g")
      .attr("transform", `translate(${22}, ${0})`)
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

    fromLeaguesAddedAxisSvg.selectAll('.domainX')
      .selectAll("line").remove();
  }

  const y = d3.scaleBand()
    .range([0, scrollFrom ? fromHeight : fromHeight - 22])
    .domain(fromData.map(d => d[0]))
    // .domain(fromData.map(d => {
    //   if (d[0].length > 40) {
    //     return `${d[0].substring(0, 40)}...`;
    //   } else {
    //     return d[0];
    //   }
    // }))
    .padding(.1);
  FROM.y = y;
  svgFrom.append('g').attr("id", 'addedFrom');

  svgFrom.selectAll("rect")
    .data(fromData)
    .enter()
    .append("rect")
    .attr("data-rect-from-league", d => d[0])
    .attr("x", x(0))
    .attr("y", d => y(d[0]))
    .attr("width", d => x(d[1].count))
    .attr("height", y.bandwidth() )
    .attr("fill", d => colors[d[1].region])
    .style("cursor", 'pointer')
    .on('mouseover', (e, d) => {
      setPointsOpacity(0.1);
      if (leaguesFilter.to) {
        let f = filteredByFrom(data, d[0]);
        f = filteredByTo(f, leaguesFilter.to);
        setPointsOpacityByFiltered(f);
      } else {
        const f = filteredByFrom(data, d[0]);
        setPointsOpacityByFiltered(f);
      }

      // hover 
      if (leaguesFilter.from && leaguesFilter.to) {
        
      } else if (leaguesFilter.from) {
        setLeaguesOpacityByFrom(d[0], 1);
      }
    })
    .on('mouseout', (e, d) => {
      if (!leaguesFilter.from && !leaguesFilter.to) {
        setPointsOpacity(1);
      } else {
        setPointsOpacity(0.1);
        const f = filteredByLeagues(data);
        setPointsOpacityByFiltered(f);
        if (leaguesFilter.from !== d[0] && !leaguesFilter.to) {
          setLeaguesOpacityByFrom(d[0], 0.1);
        } else if (leaguesFilter.from && leaguesFilter.from !== d[0] && leaguesFilter.to) {
          setLeaguesOpacityByFrom(d[0], 0.1);
        }
      }
    })
    .on('pointerdown', (e, d) => {
      chacheLeaguesFilter(d[0], null);
      setLeaguesOpacity(0.1);
      setLeaguesOpacityByLeagues(data);

      if (leaguesFilter.to && leaguesFilter.from) {
        let filtered = data.filter(t => t[toLeagueField] === leaguesFilter.to);
        filtered = filtered.filter(t => t[fromLeagueField] === leaguesFilter.from);
        setDatas(filtered, fullData);
        setTreeMap(filtered);
      } else if (leaguesFilter.from) {
        let filtered = data.filter(t => t[fromLeagueField] === leaguesFilter.from);
        setDatas(filtered, fullData);
        setTreeMap(filtered);
      } else if (!leaguesFilter.from) {
        if (leaguesFilter.to) {
          let filtered = data.filter(t => t[toLeagueField] === leaguesFilter.to);
          setDatas(filtered, fullData);
          setTreeMap(filtered);
        } else {
          setDatas(data, fullData);
          setTreeMap(data);
        }
      }

      if (leaguesFilter.to && leaguesFilter.from) {
        let filtered = data.filter(t => t[fromLeagueField] === leaguesFilter.from);
        filtered = filtered.filter(t => t[toLeagueField] === leaguesFilter.to);
        const _toLeaguesObj = {};
        filtered.forEach(t => {
          if (_toLeaguesObj[t[toLeagueField]]) {
            _toLeaguesObj[t[toLeagueField]].count += 1;
          } else {
            _toLeaguesObj[t[toLeagueField]] = {};
            _toLeaguesObj[t[toLeagueField]].count = 1;
            _toLeaguesObj[t[toLeagueField]].region = t[toRegionField];
            _toLeaguesObj[t[toLeagueField]].country = t[toCountryField];
            _toLeaguesObj[t[toLeagueField]].league = t[toLeagueField];
          }
        });
        const _fromLeaguesObj = {};
        filtered.forEach(t => {
          if (_fromLeaguesObj[t[fromLeagueField]]) {
            _fromLeaguesObj[t[fromLeagueField]].count += 1;
          } else {
            _fromLeaguesObj[t[fromLeagueField]] = {};
            _fromLeaguesObj[t[fromLeagueField]].count = 1;
            _fromLeaguesObj[t[fromLeagueField]].region = t[fromRegionField];
            _fromLeaguesObj[t[fromLeagueField]].country = t[fromCountryField];
            _fromLeaguesObj[t[fromLeagueField]].league = t[fromLeagueField];
          }
        });
        const _fromData = Object.entries(_fromLeaguesObj)
          .sort((a, b) => fromLeaguesObj[b[0]].count - fromLeaguesObj[a[0]].count);
        const _toData = Object.entries(_toLeaguesObj)
          .sort((a, b) => toLeaguesObj[b[0]].count - toLeaguesObj[a[0]].count);

        d3.selectAll(`[data-rect-to-league="${leaguesFilter.to}"]`)
          .style("opacity", 0.1);
        d3.selectAll(`[data-rect-from-league="${leaguesFilter.from}"]`)
          .style("opacity", 0.1);

        svgFrom.select("#addedFrom").selectAll("rect").remove();
        svgTo.select("#addedTo").selectAll("rect").remove();
        svgTo.select("#addedTo")
          .selectAll("rect")
          .data(_toData)
          .enter()
          .append("rect")
          .attr("data-rect-to-league-added", d => d[0])
          .attr("x", TO.x(0) )
          .attr("y", d => TO.y(d[0]))
          .attr("width", d => TO.x(d[1].count))
          .attr("height", TO.y.bandwidth() )
          .attr("fill", d => colors[d[1].region])
          .style("cursor", 'pointer');
        svgFrom.select("#addedFrom")
          .selectAll("rect")
          .data(_fromData)
          .enter()
          .append("rect")
          .attr("data-rect-from-league-added", d => d[0])
          .attr("x", FROM.x(0) )
          .attr("y", d => FROM.y(d[0]))
          .attr("width", d => FROM.x(d[1].count))
          .attr("height", FROM.y.bandwidth() )
          .attr("fill", d => colors[d[1].region])
          .style("cursor", 'pointer');
        return;
      }

      if (leaguesFilter.to && !leaguesFilter.from) {
        const filtered = data.filter(t => t[toLeagueField] === leaguesFilter.to);
        const _fromLeaguesObj = {};
        filtered.forEach(t => {
          if (_fromLeaguesObj[t[fromLeagueField]]) {
            _fromLeaguesObj[t[fromLeagueField]].count += 1;
          } else {
            _fromLeaguesObj[t[fromLeagueField]] = {};
            _fromLeaguesObj[t[fromLeagueField]].count = 1;
            _fromLeaguesObj[t[fromLeagueField]].region = t[fromRegionField];
            _fromLeaguesObj[t[fromLeagueField]].country = t[fromCountryField];
            _fromLeaguesObj[t[fromLeagueField]].league = t[fromLeagueField];
          }
        });
        const _fromData = Object.entries(_fromLeaguesObj)
          .sort((a, b) => fromLeaguesObj[b[0]].count - fromLeaguesObj[a[0]].count);

        fromData.forEach(d => {
          setLeaguesOpacityByFrom(d[0], 1);
          d3.selectAll(`[data-rect-from-league="${d[0]}"]`)
            .style("opacity", 0.4);
        });
        
        svgTo.select("#addedTo").selectAll("rect").remove();
        svgFrom.select("#addedFrom").selectAll("rect").remove();
        svgFrom.select("#addedFrom")
          .selectAll("rect")
          .data(_fromData)
          .enter()
          .append("rect")
          .attr("data-rect-from-league-added", d => d[0])
          .attr("x", FROM.x(0) )
          .attr("y", d => FROM.y(d[0]))
          .attr("width", d => FROM.x(d[1].count))
          .attr("height", FROM.y.bandwidth() )
          .attr("fill", d => colors[d[1].region])
          .style("cursor", 'pointer');
        return;
      }

      if (leaguesFilter.to || !leaguesFilter.from) {
        return;
      }
      // set TO leagues
      const filtered = data.filter(t => t[fromLeagueField] === d[0]);
      const _toLeaguesObj = {};
      filtered.forEach(t => {
        if (_toLeaguesObj[t[toLeagueField]]) {
          _toLeaguesObj[t[toLeagueField]].count += 1;
        } else {
          _toLeaguesObj[t[toLeagueField]] = {};
          _toLeaguesObj[t[toLeagueField]].count = 1;
          _toLeaguesObj[t[toLeagueField]].region = t[toRegionField];
          _toLeaguesObj[t[toLeagueField]].country = t[toCountryField];
          _toLeaguesObj[t[toLeagueField]].league = t[toLeagueField];
        }
      });
      // console.log(_toLeaguesObj);
      const _toData = Object.entries(_toLeaguesObj)
        .sort((a, b) => toLeaguesObj[b[0]].count - toLeaguesObj[a[0]].count);
      // console.log(_toData);

      toData.forEach(d => {
        setLeaguesOpacityByTo(d[0], 1);
        d3.selectAll(`[data-rect-to-league="${d[0]}"]`)
          .style("opacity", 0.4);
      });

      svgFrom.select("#addedFrom").selectAll("rect").remove();
      svgTo.select("#addedTo").selectAll("rect").remove();
      svgTo.select("#addedTo")
        .selectAll("rect")
        .data(_toData)
        .enter()
        .append("rect")
        .attr("data-rect-to-league-added", d => d[0])
        .attr("x", TO.x(0) )
        .attr("y", d => TO.y(d[0]))
        .attr("width", d => TO.x(d[1].count))
        .attr("height", TO.y.bandwidth() )
        .attr("fill", d => colors[d[1].region])
        .style("cursor", 'pointer');
    });

  svgFrom.append("g")
    .attr("class", `domainY`)
    .attr("transform", `translate(${12}, 0)`)
    .call(d3.axisLeft(y))
    .style("pointer-events", 'none')
    .call(g => g.select(".domain").remove());
  svgFrom.selectAll('.domainY')
    .selectAll("line").remove();
  svgFrom.selectAll('.domainY')
    .selectAll("text")
    .style("font-size", '12px')
    .attr("text-anchor", 'start')
    .attr("data-text-from-league", d => d)
    .text(d => {
        if (d.length > 40) {
        return `${d.substring(0, 40)}...`;
      } else {
        return d;
      }
    });
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
    span.dataset.flagFromLeague = fromData[i][0];
    span.textContent = countries[fromData[i][1].country];
    // remove test
    // span.addEventListener('mouseover', () => {
    //   setPointsOpacity(0.1);
    //   const f = filteredByFrom(data, fromData[i][0]);
    //   setPointsOpacityByFiltered(f);
    // });
    // span.addEventListener('mouseout', () => {
    //   setPointsOpacity(1);
    // });

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
  // TO
  {
  const ticks = [];
  const x = d3.scaleLinear()
    .domain([0, maxTo])
    .range([0, width - 12 - flagDX * 2]);
  TO.x = x;
  if (!scrollTo) {
    d3.select("#toLeaguesAddedAxisSvg").remove();
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
  } else {
    d3.select("#toLeaguesAddedAxisSvg").remove();
    const toLeaguesAddedAxisSvg = d3.select("#transfersDataWrapper")
      .append('svg')
        .attr("id", 'toLeaguesAddedAxisSvg')
        .attr("width", width - 12)
        .attr("height", 20)
        .attr("transform", `translate(${width}, ${0})`);
    toLeaguesAddedAxisSvg.append("g")
      .attr("transform", `translate(${22}, ${0})`)
      .attr("class", `domainX`)
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
    
    toLeaguesAddedAxisSvg.selectAll('.domainX')
      .selectAll("line").remove();
  }

  const y = d3.scaleBand()
    .range([0, scrollTo ? toHeight : toHeight - 22])
    .domain(toData.map(d => d[0]))
    .padding(.1);
  TO.y = y;
  svgTo.append('g').attr("id", 'addedTo');

  svgTo.selectAll("rect")
    .data(toData)
    .enter()
    .append("rect")
    .attr("data-rect-to-league", d => d[0])
    .attr("x", x(0) )
    .attr("y", d => y(d[0]))
    .attr("width", d => x(d[1].count))
    .attr("height", y.bandwidth() )
    .attr("fill", d => colors[d[1].region])
    .style("cursor", 'pointer')
    .on('mouseover', (e, d) => {
      setPointsOpacity(0.1);
      if (leaguesFilter.from && leaguesFilter.to) {
        let f = filteredByTo(data, d[0]);
        f = filteredByFrom(f, leaguesFilter.from);
        setPointsOpacityByFiltered(f);
      } else if (leaguesFilter.from) {
        let f = filteredByTo(data, d[0]);
        f = filteredByFrom(f, leaguesFilter.from);
        setPointsOpacityByFiltered(f);
      } else {
        const f = filteredByTo(data, d[0]);
        setPointsOpacityByFiltered(f);
      }
      // hover 
      if (leaguesFilter.to && leaguesFilter.from) {
        
      } else if (leaguesFilter.to) {
        setLeaguesOpacityByTo(d[0], 1);
      }
    })
    .on('mouseout', (e, d) => {
      if (!leaguesFilter.to && !leaguesFilter.from) {
        setPointsOpacity(1);
      } else {
        setPointsOpacity(0.1);
        const f = filteredByLeagues(data);
        setPointsOpacityByFiltered(f);
        if (leaguesFilter.to !== d[0] && !leaguesFilter.from) {
          setLeaguesOpacityByTo(d[0], 0.1);
        } else if (leaguesFilter.to && leaguesFilter.to !== d[0] && leaguesFilter.from) {
          setLeaguesOpacityByTo(d[0], 0.1);
        }
      }
    })
    .on('pointerdown', (e, d) => {
      chacheLeaguesFilter(null, d[0]);
      setLeaguesOpacity(0.1);
      setLeaguesOpacityByLeagues(data);

      if (leaguesFilter.to && leaguesFilter.from) {
        let filtered = data.filter(t => t[toLeagueField] === leaguesFilter.to);
        filtered = filtered.filter(t => t[fromLeagueField] === leaguesFilter.from);
        setDatas(filtered, fullData);
        setTreeMap(filtered);
      } else if (leaguesFilter.to) {
        let filtered = data.filter(t => t[toLeagueField] === leaguesFilter.to);
        setDatas(filtered, fullData);
        setTreeMap(filtered);
      } else if (!leaguesFilter.to) {
        if (leaguesFilter.from) {
          let filtered = data.filter(t => t[fromLeagueField] === leaguesFilter.from);
          setDatas(filtered, fullData);
          setTreeMap(filtered);
        } else {
          setDatas(data, fullData);
          setTreeMap(data);
        }
      }

      if (leaguesFilter.to && leaguesFilter.from) {
        let filtered = data.filter(t => t[toLeagueField] === leaguesFilter.to);
        filtered = filtered.filter(t => t[fromLeagueField] === leaguesFilter.from);
        const _toLeaguesObj = {};
        filtered.forEach(t => {
          if (_toLeaguesObj[t[toLeagueField]]) {
            _toLeaguesObj[t[toLeagueField]].count += 1;
          } else {
            _toLeaguesObj[t[toLeagueField]] = {};
            _toLeaguesObj[t[toLeagueField]].count = 1;
            _toLeaguesObj[t[toLeagueField]].region = t[toRegionField];
            _toLeaguesObj[t[toLeagueField]].country = t[toCountryField];
            _toLeaguesObj[t[toLeagueField]].league = t[toLeagueField];
          }
        });
        const _fromLeaguesObj = {};
        filtered.forEach(t => {
          if (_fromLeaguesObj[t[fromLeagueField]]) {
            _fromLeaguesObj[t[fromLeagueField]].count += 1;
          } else {
            _fromLeaguesObj[t[fromLeagueField]] = {};
            _fromLeaguesObj[t[fromLeagueField]].count = 1;
            _fromLeaguesObj[t[fromLeagueField]].region = t[fromRegionField];
            _fromLeaguesObj[t[fromLeagueField]].country = t[fromCountryField];
            _fromLeaguesObj[t[fromLeagueField]].league = t[fromLeagueField];
          }
        });
        const _toData = Object.entries(_toLeaguesObj)
          .sort((a, b) => toLeaguesObj[b[0]].count - toLeaguesObj[a[0]].count);
        const _fromData = Object.entries(_fromLeaguesObj)
          .sort((a, b) => fromLeaguesObj[b[0]].count - fromLeaguesObj[a[0]].count);

        d3.selectAll(`[data-rect-from-league="${leaguesFilter.from}"]`)
          .style("opacity", 0.1);
        d3.selectAll(`[data-rect-to-league="${leaguesFilter.to}"]`)
          .style("opacity", 0.1);

        svgTo.select("#addedTo").selectAll("rect").remove();
        svgFrom.select("#addedFrom").selectAll("rect").remove();
        svgFrom.select("#addedFrom")
          .selectAll("rect")
          .data(_fromData)
          .enter()
          .append("rect")
          .attr("data-rect-from-league-added", d => d[0])
          .attr("x", FROM.x(0) )
          .attr("y", d => FROM.y(d[0]))
          .attr("width", d => FROM.x(d[1].count))
          .attr("height", FROM.y.bandwidth() )
          .attr("fill", d => colors[d[1].region])
          .style("cursor", 'pointer');
        svgTo.select("#addedTo")
          .selectAll("rect")
          .data(_toData)
          .enter()
          .append("rect")
          .attr("data-rect-to-league-added", d => d[0])
          .attr("x", TO.x(0) )
          .attr("y", d => TO.y(d[0]))
          .attr("width", d => TO.x(d[1].count))
          .attr("height", TO.y.bandwidth() )
          .attr("fill", d => colors[d[1].region])
          .style("cursor", 'pointer');
        return;
      }

      if (leaguesFilter.from && !leaguesFilter.to) {
        const filtered = data.filter(t => t[fromLeagueField] === leaguesFilter.from);
        const _toLeaguesObj = {};
        filtered.forEach(t => {
          if (_toLeaguesObj[t[toLeagueField]]) {
            _toLeaguesObj[t[toLeagueField]].count += 1;
          } else {
            _toLeaguesObj[t[toLeagueField]] = {};
            _toLeaguesObj[t[toLeagueField]].count = 1;
            _toLeaguesObj[t[toLeagueField]].region = t[toRegionField];
            _toLeaguesObj[t[toLeagueField]].country = t[toCountryField];
            _toLeaguesObj[t[toLeagueField]].league = t[toLeagueField];
          }
        });
        const _toData = Object.entries(_toLeaguesObj)
          .sort((a, b) => toLeaguesObj[b[0]].count - toLeaguesObj[a[0]].count);
        toData.forEach(d => {
          setLeaguesOpacityByTo(d[0], 1);
          d3.selectAll(`[data-rect-to-league="${d[0]}"]`)
            .style("opacity", 0.4);
        });

        svgFrom.select("#addedFrom").selectAll("rect").remove();
        svgTo.select("#addedTo").selectAll("rect").remove();
        svgTo.select("#addedTo")
          .selectAll("rect")
          .data(_toData)
          .enter()
          .append("rect")
          .attr("data-rect-to-league-added", d => d[0])
          .attr("x", TO.x(0) )
          .attr("y", d => TO.y(d[0]))
          .attr("width", d => TO.x(d[1].count))
          .attr("height", TO.y.bandwidth() )
          .attr("fill", d => colors[d[1].region])
          .style("cursor", 'pointer');
        return;
      }

      if (leaguesFilter.from || !leaguesFilter.to) {
        return;
      }
      // set FROM leagues
      const filtered = data.filter(t => t[toLeagueField] === d[0]);
      const _fromLeaguesObj = {};
      filtered.forEach(t => {
        if (_fromLeaguesObj[t[fromLeagueField]]) {
          _fromLeaguesObj[t[fromLeagueField]].count += 1;
        } else {
          _fromLeaguesObj[t[fromLeagueField]] = {};
          _fromLeaguesObj[t[fromLeagueField]].count = 1;
          _fromLeaguesObj[t[fromLeagueField]].region = t[fromRegionField];
          _fromLeaguesObj[t[fromLeagueField]].country = t[fromCountryField];
          _fromLeaguesObj[t[fromLeagueField]].league = t[fromLeagueField];
        }
      });
      // console.log(_fromLeaguesObj);
      const _fromData = Object.entries(_fromLeaguesObj)
        .sort((a, b) => fromLeaguesObj[b[0]].count - fromLeaguesObj[a[0]].count);
      // console.log(_fromData);

      fromData.forEach(d => {
        setLeaguesOpacityByFrom(d[0], 1);
        d3.selectAll(`[data-rect-from-league="${d[0]}"]`)
          .style("opacity", 0.4);
      });
      
      svgTo.select("#addedTo").selectAll("rect").remove();
      svgFrom.select("#addedFrom").selectAll("rect").remove();
      svgFrom.select("#addedFrom")
        .selectAll("rect")
        .data(_fromData)
        .enter()
        .append("rect")
        .attr("data-rect-from-league-added", d => d[0])
        .attr("x", FROM.x(0) )
        .attr("y", d => FROM.y(d[0]))
        .attr("width", d => FROM.x(d[1].count))
        .attr("height", FROM.y.bandwidth() )
        .attr("fill", d => colors[d[1].region])
        .style("cursor", 'pointer');
    });

  svgTo.append("g")
    .attr("class", `domainY`)
    .attr("transform", `translate(${12}, 0)`)
    .call(d3.axisLeft(y))
    .style("pointer-events", 'none')
    .call(g => g.select(".domain").remove());
  svgTo.selectAll('.domainY')
    .selectAll("line").remove();
  svgTo.selectAll('.domainY')
    .selectAll("text")
    .style("font-size", '12px')
    .attr("text-anchor", 'start')
    .attr("data-text-to-league", d => d)
    .text(d => {
        if (d.length > 40) {
        return `${d.substring(0, 40)}...`;
      } else {
        return d;
      }
    });
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
    span.dataset.flagToLeague = toData[i][0];
    span.textContent = countries[toData[i][1].country];
    // remove test
    // span.addEventListener('mouseover', () => {
    //   setPointsOpacity(0.1);
    //   const f = filteredByTo(data, toData[i][0]);
    //   setPointsOpacityByFiltered(f);
    // });
    // span.addEventListener('mouseout', () => {
    //   setPointsOpacity(1);
    // });

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