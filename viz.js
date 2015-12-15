/*
TODO:
  1. Write an rdf to triples object parser, probably turtle/n3 since they are more common.
  2. Eventually handle nested relationships and actual linked data.
  3. Implement the fisheye effect.
  4. Center the svg container and make things pretty.
  5. color code the nodes, as well as render labels.
  
Issues:
  1. Fisheye effect won't apply until the simulation is done rendering.
*/

// ==============================================================
// Process the data into nodes and links
// Data is in the form of subject-object-predicate
var process_triples = function( /*triples*/ ) {
  var data = {
    nodes: [],
    links: []
  };
  // Create a sample RDF relationship
  // The hard part will be creating the correct links  
  var triples = [{
    // This becomes the source node
    subject: 'Cory',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Spiderman'
  }, {
    // This becomes the source node
    subject: 'Cory',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Superman'
  }, {
    // This becomes the source node
    subject: 'Cory',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Lex'
  }, {
    // This becomes the source node
    subject: 'Cory',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Flash'
  }, {
    // This becomes the source node
    subject: 'Flash',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Superman'
  }, {
    // This becomes the source node
    subject: 'Cory',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Spiderman'
  }, {
    // This becomes the source node
    subject: 'Cory',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Jerald'
  }, {
    // This becomes the source node
    subject: 'Jerald',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Apple'
  }, {
    // This becomes the source node
    subject: 'Cory',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Sara'
  }, {
    // This becomes the source node
    subject: 'Flash',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Sara'
  }, {
    // This becomes the source node
    subject: 'Sara',
    // This is the target node
    predicate: 'knows',
    // This is an edge
    object: 'Superman'
  }];

  for (var i = 0; i < triples.length; i++) {
    // Create the vertices
    if (index_of(data.nodes, triples[i].subject) === -1) {
      data.nodes.push({
        label: triples[i].subject
      });
    }

    if (index_of(data.nodes, triples[i].object) === -1) {
      data.nodes.push({
        label: triples[i].object
      });
    }
  }
  console.log(data.nodes);

  // Create the links
  for (var i = 0; i < triples.length; i++) {
    data.links.push({
      source: index_of(data.nodes, triples[i].subject),
      target: index_of(data.nodes, triples[i].object),
      predicate: triples[i].predicate
    });
  }

  return data;
};
// ==============================================================

// ==============================================================
// This takes an array of objects and finds the index of the 
// object containing a certain value
// this is also just plain hideous
var index_of = function(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    for (var prop in arr[i]) {
      if (arr[i][prop] === val) {
        return i;
      }
    }
  }
  return -1;
};
// ==============================================================

// ==============================================================
// turtle/n3 to triples object parser (Unimplemented)
// ==============================================================

// ==============================================================
// Begin creating the force directed graph layout
var width = 540,
  height = 540;

// An array to hold the nodes, which are just
// arbitrary objects.
/*
var nodes = [
  {x: width/3, y: height/2},
  {x: 2*width/3, y: height/2},
  {x: 3*width/3, y: 2*height/2}
];
*/

/*var nodes = process_triples().nodes;
var links = process_triples().links;*/

// An array to hold the edges or "links"
// between each node. 
/*
var links = [
  {source: 0, target: 1},
  {source: 0, target: 2},
  {source: 1, target: 2}
];
*/

// ==============================================================
// Create dummy nodes and links
/*var data = process_triples();
var nodes_list = data.nodes;
var links_list = data.links;*/

var nodes_list = [];
var links_list = [];

var max = Math.floor(Math.random() * (100 - 1) + 1);
for (var i = 0; i < max; i++) {
  nodes_list.push({
    number: i
  });
}

for (var i = 0; i < nodes_list.length; i++) {
  var source = Math.floor(Math.random() * (nodes_list.length - 1) + 1);
  var target = Math.floor(Math.random() * (nodes_list.length - 1) + 1);
  links_list.push({
    source: source,
    target: target
  });
}
// ==============================================================

// ==============================================================
// Create a fisheye distortion instance
var fisheye = d3.fisheye.circular()
  .radius(80)
  .distortion(5);
// ==============================================================

var color = d3.scale.category20();

var svg = d3.select('#graph_div').append('svg')
  .attr('width', width)
  .attr('height', height);

// Create a force graph
var force = d3.layout.force()
  .charge(-120)
  .size([width, height])
  .gravity(.5)
  .nodes(nodes_list)
  .links(links_list);

// Set the link distance in px
force.linkDistance(Math.floor((1 / Math.sqrt(nodes_list.length)) + 40));
/*force.linkDistance(function (n, d) {
  return Math.floor((1 / Math.sqrt(d)) + 40);
})*/

var link = svg.selectAll('.link')
  .data(links_list)
 .enter().append('line')
  .attr('class', 'link');

var node = svg.selectAll('.node')
  .data(nodes_list)
 .enter().append('circle')
  .attr('class', 'node')
  .style("fill", function(d) {
    return color(d.number);
  })
  .call(force.drag);

// ==============================================================
// define what to do when force is done
// calculating things
force.on('tick', function() {
  // Set the radius of the nodes
  node.attr('r', 4.5)
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    });

  // Update the edges
  link.attr('x1', function(d) {
      return d.source.x;
    })
    .attr('y1', function(d) {
      return d.source.y;
    })
    .attr('x2', function(d) {
      return d.target.x;
    })
    .attr('y2', function(d) {
      return d.target.y;
    });
});
// ==============================================================
// Apply the fisheye distortion to the svg instance
svg.on('mousemove', function() {
  fisheye.focus(d3.mouse(this));

  node.each(function(d) {
      d.fisheye = fisheye(d);
    })
    .attr("cx", function(d) {
      return d.fisheye.x;
    })
    .attr("cy", function(d) {
      return d.fisheye.y;
    })
    .attr("r", function(d) {
      return d.fisheye.z * 4.5;
    });

  link.attr("x1", function(d) {
      return d.source.fisheye.x;
    })
    .attr("y1", function(d) {
      return d.source.fisheye.y;
    })
    .attr("x2", function(d) {
      return d.target.fisheye.x;
    })
    .attr("y2", function(d) {
      return d.target.fisheye.y;
    });
});

/*var n = force.nodes.length;
force.nodes.forEach(function(d, i) {
  d.x = d.y = width / n * i;
});*/

// Start the force graph simulation on it's way.
force.start();
// ==============================================================
