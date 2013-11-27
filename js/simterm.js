!function () {

	var svg,
		area,
		y,
		x,
		width, height,
		color,
		n = 20, // number of layers
		m = 200 // number of samples per layer


	function bumpLayer(n) {

		function bump(a) {

			var x = 1 / (.1 + Math.random()),
				y = 2 * Math.random() - .5,
				z = 10 / (.1 + Math.random())

			for (var i = 0; i < n; i++) {

				var w = (i / n - y) * z

				a[i] += x * Math.exp(-w * w)
			}
		}

		var a = [],
			i

		for (i = 0; i < n; ++i) a[i] = 0

		for (i = 0; i < 5; ++i) bump(a)

		return a.map(function (d, i) {
			return {x: i, y: Math.max(0, d)}
		})
	}

	function renderStreamGraph(data) {


		width = 960
		height = 500

		x = d3
			.scale
			.linear()
			.domain([0, m - 1])
			.range([0, width])

		y = d3
			.scale
			.linear()
			.domain([0, d3.max(layers0.concat(layers1), function (layer) {
				return d3.max(layer, function (d) {
					return d.y0 + d.y
				})
			})])
			.range([height, 0])

		color = d3
			.scale
			.linear()
			.range(["rgb(255,0,0)", "rgb(0,0,255)"])

		area = d3
			.svg
			.area()
			.x(function (d) {
				return x(d.x)
			})
			.y0(function (d) {
				return y(d.y0)
			})
			.y1(function (d) {
				return y(d.y0 + d.y)
			})

		svg = d3
			.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height)

		svg
			.selectAll("path")
			.data(layers0)
			.enter()
			.append("path")
			.attr("d", area)
			.style("fill", function () {
				return color(Math.random())
			})

		function transition() {
			d3
				.selectAll("path")
				.data(function () {
					var d = layers1

					layers1 = layers0
					return layers0 = d
				})
				.transition()
				.duration(2500)
				.attr("d", area)
		}
	}

	//console.log(bumpLayer(100))

	$.ajax({
		url: 'http://localhost:1234/simterm',
		success: function (data) {



			function processData(data){

				var


				data.associations.forEach(function (assoc) {
					assoc.terms = assoc.terms.map(function (d, i) {


						return {
							x: i,
							y: d.value
						}
					})
				})

				return data
			}


			var stack = d3.layout.stack().offset("wiggle"),
				layers0 = stack(
					d3
						.range(n)
						.map(function () {
							return processData(data)
						})
				),
				layers1 = stack(
					d3
						.range(n)
						.map(function () {
							return processData(data)
						})
				)

			//console.log(data)

		},
		error: function (data) {
			console.error(data)
		}

	})
}()