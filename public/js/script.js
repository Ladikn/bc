/*function preventBack() { window.history.forward(); }
setTimeout("preventBack()", 0);
window.onunload = function () { null };*/
/*function setFocus() {
	var isAtLeastIE11 = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));
	//alert(isAtLeastIE11);
	if (navigator.userAgent.search("MSIE") >= 0 || isAtLeastIE11 == true) {
		alert("Please use browser other than Internet Explorer");
		document.getElementById("loginBtn").disabled = true;
		document.getElementById("userName").disabled = true;
		document.getElementById("password").disabled = true;
	}
	document.getElementById("userName");
}*/

$(function() {
	if (window.location != "./#") {
		window.location.replace("./#")
		console.log("refreshed")
	}

});

var jsonurl = '/services/categories/organized';

var category = 'blockchain';
var catTitle = 'BlockChain'

var width = $(window).width() / 1.7,
	height = $(window).height() / 1.2,
	radius = Math.min(width, height) / 2;


var x = d3.scale.linear()
	.range([0, 2 * Math.PI]);

var y = d3.scale.linear()
	.range([0, radius]);

var color = d3.scale.category20c();

var svg = d3.select("#svgstart").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

var partition = d3.layout.partition()
	.value(function(d) {
		return d.size;
	});

var arc = d3.svg.arc()
	.startAngle(function(d) {
		return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
	})
	.endAngle(function(d) {
		return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
	})
	.innerRadius(function(d) {
		return Math.max(0, y(d.y));
	})
	.outerRadius(function(d) {
		return Math.max(0, y(d.y + d.dy));
	});


d3.xhr(jsonurl, function(error, root) {
	root = $.parseJSON(root.response);
	var g = svg.selectAll("g")
		.data(partition.nodes(root))
		.enter().append("g");

	var path = g.append("path")
		.attr("d", arc)
		.attr("id", function(d) {
			return d.key
		})
		.attr("internal", function(d) {
			return d.internal;
		})
		.style("fill", function(d) {
			return d.color;
		}) //return color((d.children ? d : d.parent).name); })
		.on("click", click);

	var text = g.append("text")
		.attr("transform", function(d) {
			if (y(d.y) == 0) {
				return "rotate(0)";
			} else {
				return "rotate(" + computeTextRotation(d) + ")";
			}
		})
		.attr("class", function(d) {
			if (y(d.y) == 0) {
				return "center";
			} else {
				return "noncenter";
			}
		})
		.attr("id", function(d) {
			return d.key;
		})
		.attr("x", function(d) {
			return y(d.y);
		})
		//.attr("dx", 2) // margin
		//.attr("dy", 2) // vertical-align
		.attr("fill", "#fff")
		.each(function(d) {
			var n;
			if (d.name.length >= 15 && (d.name.split(" ").length) > 1) {
				n = d.name.split(" ");
				for (i = 0; i < n.length; i++) {
					d3.select(this).append("tspan")
						.attr("dy", i ? "1em" : "-2px")
						.attr("dx", 9)
						.attr("x", i ? function() {
							return parseFloat($(this.parentNode).attr("x"));
						} : null)
						//	.attr("transform", i ? "rotate(50)" : null)
						.text(n[i])
				}
			} else {
				n = [d.name];
				d3.select(this).append("tspan")
					.attr("dy", 4)
					.attr("dx", 9)
					.text(n)
			}
		});


	var image = g.data([0]).append("image")
		.attr("xlink:href", "images/logo-symbol.png")
		.attr("width", "12%")
		.attr("height", "12%")
		.attr("x", function(d) {
			return "-6.0%"; // calculate x
		}).attr("y", function(d) {
			return "-10%"; // calculate y
		});

	function click(d) {
		// fade out all text elements and images
		text.transition().attr("opacity", 0);
		image.transition().duration(250).attr("display", "none");

		// Set right articles
		if (d.parent == null) {
			window.location.replace("./#");
		} else if (d.internal) {
			window.catTitle = d.name;
			window.category = d.key;
			window.location.replace("./#internal")
		} else {
			window.catTitle = d.name;
			window.category = d.key;
			window.location.replace("./#external")
		}

		path.transition()
			.duration(250)
			.attrTween("d", arcTween(d))
			.each("end", function(e, i) {
				// check if the animated element's data e lies within the visible angle span given in d
				if (e.x >= d.x && e.x < (d.x + d.dx)) {
					// get a selection of the associated text element
					var arcText = d3.select(this.parentNode).select("text");

					// fade in the text element and recalculate positions
					arcText.transition().duration(250)
						.attr("opacity", 1)
						.attr("transform", function() {
							return "rotate(" + computeTextRotation(e) + ")"
						})
						.attr("x", function(d) {
							return y(d.y);
						})
						.attr("class", function(x) {
							if (d.depth == 1) {
								return "layer1";
							} else if (d.depth == 2) {
								return "layer2";
							} else {
								blockchain
								if (x == 0) {
									return "center";
								} else {
									return "noncenter";
								}
							}
						})
						.each("end", function() {
							tx = $(this).attr("x");
							$(this).children().each(function(i, d) {
								if (i > 0) {
									$(d).attr("x", tx);
								}
							})
						});
				}
			});
		if (this.id == "blockchain") {
			image.transition().duration(250).attr("display", "inline");
		}
	}
});

d3.select(self.frameElement).style("height", height + "px");

//Set right box height to be equal to circle height

$("#right-col").height($("#svgstart").height() - 45);

// Interpolate the scales!
function arcTween(d) {
	var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
		yd = d3.interpolate(y.domain(), [d.y, 1]),
		yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
	return function(d, i) {
		return i ?

			function(t) {
				return arc(d);
			} :
			function(t) {
				x.domain(xd(t));
				y.domain(yd(t)).range(yr(t));
				return arc(d);
			};
	};
}

function computeTextRotation(d) {
	return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
	/*Work in progress code to fix text rotation.  Needs to be transitioned out of .attr and into .attrTween
	var n = (d.name || "").split(" ").length > 1;
	var e = 180 * x(d.x + d.dx / 2) / Math.PI - 90,
		r = e + (n ? -.5 : 0);
	return r + ")translate(" + (x(d.y) + 5) + ")rotate(" + (e > 90 ? -180 : 0)*/
}