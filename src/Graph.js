import './App.css';
import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

function Graph() {
	var width = 500;
	var height = 500;

	let nodes = [
		{ name: 1, c: true },
		{ name: 2, c: false },
		{ name: 3, c: true },
		{ name: 4, c: false },
		{ name: 5, c: true },
		{ name: 6, c: false },
	]

	let links = [
		{ source: nodes[0], target: nodes[1] },
		{ source: nodes[1], target: nodes[2] },
		{ source: nodes[2], target: nodes[0] },
		{ source: nodes[2], target: nodes[3] },
		{ source: nodes[2], target: nodes[4] },
		{ source: nodes[2], target: nodes[5] },
	]

	var graphRef = useRef();
	var simulation = useRef();
	var node = useRef();
	var link = useRef();

	useEffect(() => {
		console.log(graphRef.current.children[0])

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

	var update = function () {
		console.log(graphRef.current);

		simulation.current.nodes(nodes);
		simulation.current.force("link").links(links);
		simulation.current.alpha(1).restart();

		node.current = node.current
			.data(nodes, d => d.id)
			.join(enter => enter.append("circle"))
			.attr("fill", d => d.c ? "#000" : "#fff")
			.attr("stroke", d => d.c ? "#fff" : "#000")
			.attr("r", 10)
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
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event, d) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event, d) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
		return d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);
	}


	let prev = true;

	const click = () => {
		nodes.push({
			"id": nodes.length,
			c: !prev
		});
		prev = !prev;
		links.push({
			"source": nodes[0],
			"target": nodes[nodes.length - 1],
		});
		update()
	};


	return (
		<div ref={graphRef} className="graph">
			<svg id="mySvg" height="450" width="450" style={{ "backgroundColor": "gray" }}></svg>
			<button id="update" onClick={click}>Update</button>
		</div>
	)
}

export default Graph;