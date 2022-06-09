import './App.css';
import * as d3 from 'd3';
import { useRef, useEffect, useState } from 'react';

function Graph(props) {
  var width = 500;
  var height = 500;

  let nodes = props.history;

  const [links, setLinks] = useState([]);

  var graphRef = useRef();

  var simulation = useRef();
  var node = useRef();
  var link = useRef();

  useEffect(() => {
    // console.log("initial graph")

    var svg = d3.select(graphRef.current.children[0])
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    link.current = svg.append("g")
      .selectAll("line");

    node.current = svg.append("g")
      .selectAll("circle");

    simulation.current = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id).distance(50).strength(1))
      .force("charge", d3.forceManyBody().strength(-1000))
      // .force("center", d3.forceCenter())
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", ticked);

    function ticked() {
      node.current.attr("cx", d => d.x)
        .attr("cy", d => d.y)

      link.current.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    }

    update()

  }, []);

  useEffect(() => {
    // console.log("graph")
    let last = nodes[nodes.length-1];
    if (last.parent!=="") {
      setLinks((prevLinks)=>[...prevLinks, {
        "source": nodes.find((val)=>val.id===last.parent),
        "target": last
      }])
    }
    // update();
  }, [props.history])

  useEffect(() => {
    // console.log(links);
    update();
  }, [links])

  var update = function () {
    // console.log("updating");

    simulation.current.nodes(nodes);
    simulation.current.force("link").links(links);
    simulation.current.alpha(1).restart();

    node.current = node.current
      .data(nodes, d => d.id)
      .join(enter => enter.append("circle"))
      .attr("fill", d => {
        if (d.id==="CCC") {return "#1e7055"}
        else if (d.color==="pw") {return "white"}
        else {return "black"}
      })
      .attr("stroke-width", d => d.selected ? 5 : 0)
      .attr("stroke", "#c2c2c2")
      .attr("r", d => d.selected ? 12 : 10)
      .classed("fixed", d => d.id==="CCC")
      .on("dblclick", (d, a)=>{
        props.goPast(a.id);
      })
      .call(drag(simulation.current))

    link.current = link.current
      .data(links)
      .join("line")
      .attr("stroke", "white")
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 3)
  }

  function drag(simulation) {
    function dragstarted(event, d) {
      // if (d.id!=="CCC") {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      // }
    }

    function dragged(event, d) {
      // if (d.id!=="CCC") {
        d.fx = event.x;
        d.fy = event.y;
      // }
    }

    function dragended(event, d) {
      // if (d.id!=="CCC") {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      // }
    }
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return (
    <div ref={graphRef} className="graph">
      <svg id="mySvg" height="450" width="450" style={{ "backgroundColor": "gray" }}></svg>
    </div>
  )
}

export default Graph;