const tooltip = document.getElementById("tooltip");

async function run() {
  console.log('run');
  const eduResp = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json');
  const educations = await eduResp.json();
  
  const countiesResp =await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json');
  const counties = await countiesResp.json();

  var width = $(window).width() - 330,
    height = $(window).height() - 100,
    xPadding = 40,
    yPadding = 40,
    xyrPadding = 40;
    // barWidth = width / data.length;
  console.log(counties);

  const path = d3.geoPath();
  const data = topojson.feature(counties, counties.objects.counties).features;

  const colorScale =  d3.scaleThreshold()
  .domain(d3.range(d3.min(educations, edu => edu.bachelorsOrHigher), 
  d3.max(educations, edu => edu.bachelorsOrHigher), 
  (d3.max(educations, edu => edu.bachelorsOrHigher)-d3.min(educations, edu => edu.bachelorsOrHigher))/8))
  .range(d3.schemeBlues[9]);
  
  var svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width + xPadding + xyrPadding)
    .attr("height", height + yPadding + xyrPadding);

  svg.append('g')
    .selectAll('path')  
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('fill', d => colorScale(educations.find(edu => edu.fips === d.id).bachelorsOrHigher))
    .attr('data-fips', d => d.id)
    .attr('data-education', d => educations.find(edu => edu.fips === d.id).bachelorsOrHigher)
    .attr('d', path)
    .on("mousemove", (d, item) => {
      console.log(d, item,item.id);
      tooltip.style.left = d.pageX + (xyrPadding / 2) + "px";
      tooltip.style.top = d.pageY - xyrPadding + "px";
      const education = educations.find(edu => edu.fips === item.id);
      console.log(education.bachelorsOrHigher);
      tooltip.innerHTML = 
      `${education.area_name}, ${education.state} ${education.bachelorsOrHigher}%`;
      console.log(education);
      tooltip.setAttribute("data-education", education.bachelorsOrHigher);
    })
    .on("mouseover", () => (tooltip.style.visibility = "visible"))
    .on("mouseout", () => (tooltip.style.visibility = "hidden"));



};


// US Education Data: https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json
// US County Data: https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json

// fetch(
//   "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
// )
//   .then((res) => res.json())
//   .then((res) => {
//     console.log(res);
//     createGraph(
//       res.map((r) => [
//         new Date(1970, 0, 1, 0, r.Time.split(":")[0], r.Time.split(":")[1]),
//         r.Year,
//         r.Doping,
//         r.Name,
//         r.Nationality,
//       ])
//     );
//   });

// function createGraph(data) {
//   console.log(data);
//   var width = $(window).width() - 480,
//     height = $(window).height() - 180,
//     xPadding = 60,
//     yPadding = 40,
//     xyrPadding = 40,
//     barWidth = width / data.length;

//   var xScale = d3
//     .scaleLinear()
//     .domain([d3.min(data, (d) => d[1] - 1), d3.max(data, (d) => d[1] + 1)])
//     .range([xPadding, width + xPadding]);

//   var timeFormat = d3.timeFormat("%M:%S");

//   var yScale = d3
//     .scaleTime()
//     .domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
//     .range([yPadding, height + yPadding]);

//   var svg = d3
//     .select("body")
//     .append("svg")
//     .attr("width", width + xPadding + xyrPadding)
//     .attr("height", height + yPadding + xyrPadding);

//   svg
//     .selectAll("dot")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("class", "dot")
//     .attr("data-xvalue", (d) => d[1])
//     .attr("data-yvalue", (d) => d[0])
//     .attr("r", 6)
//     .attr("cx", (d) => xScale(d[1]))
//     .attr("cy", (d) => yScale(d[0]) + yPadding - xyrPadding)
//     .attr("fill", d => d[2] === '' ? 'blue' : 'red')
//     .attr("fill-opacity", "50%")
//     .attr("stroke", "black")
//     .on("mousemove", (d, item) => {
//       tooltip.style.left = d.pageX + (xyrPadding / 2) + "px";
//       tooltip.style.top = d.pageY - xyrPadding + "px";
//       tooltip.innerHTML = `
//       Name: ${item[3]} ${item[4]? `(${item[4]})` : ``}<br/>
//       Time: ${item[0].getMinutes()}:${item[0].getSeconds()} Year: ${item[1]}<br/>
//       <small><em>${item[2] ? "&ldquo;"+item[2]+"&rdquo;" : ''}</small>`;

//       tooltip.setAttribute("data-year", item[1]);
//     })
//     .on("mouseover", () => (tooltip.style.visibility = "visible"))
//     .on("mouseout", () => (tooltip.style.visibility = "hidden"));

//   var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

//   var xAxisGroup = svg
//     .append("g")
//     .attr("transform", `translate(0, ${height + xyrPadding})`)
//     .attr("id", "x-axis")
//     .call(xAxis);

//   var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

//   var yAxisGroup = svg
//     .append("g")
//     .attr("transform", `translate(${xPadding}, -${yPadding - xyrPadding})`)
//     .attr("id", "y-axis")
//     .call(yAxis);
// }
run();