!function () {

	var numberOfLayers = 20,
		numberOfSamples = 200,
		width = 400,
		height = 300,
		stackFunc,
		areaFunc,
		svg,
		testData,
		colors,
		xScaleFunc,
		yScaleFunc

	colors = ['green', 'blue', 'yellow', 'red']

	testData = [
		[
			[10, 11],
			[20, 5],
			[30, 27],
			[40, 14]
		],
		[
			[10, 12],
			[20, 5],
			[30, 13],
			[40, 14]
		]
	]


	function getMinMax(layers, type) {

		return new Date(d3[type](layers[0].values.map(function (d) {
			return d.x
		})))
	}


	$.ajax({
		url: 'data/simterm.json',
		//url: 'http://localhost:1234/simterm',
		success: function (data) {

			var layers = [],
				indexDict = {}

			// Map data to layer-style data
			data.associations.forEach(function (momentObject) {

				momentObject.terms.forEach(function (term, i) {


					// Create layer if not yet defined
					if (indexDict[term.name] === undefined) {
						layers.push({
							name: term.name,
							values: []
						})

						indexDict[term.name] = layers.length - 1
					}

					layers[indexDict[term.name]].values.push({
						x: momentObject.time,
						y: term.value
					})
				})
			})

			console.log(JSON.parse(JSON.stringify(layers)))
			console.log(layers)

			//console.log([getMinMax(layers, 'min'), getMinMax(layers, 'max')])

			xScaleFunc = d3
				.time
				.scale()
				.domain([getMinMax(layers, 'min'), getMinMax(layers, 'max')])
				.range([0, width])

			yScaleFunc = d3
				.scale
				.linear()
				.domain([0, 10])
				.range([height, 0])


			stackFunc = d3
				.layout
				.stack()
				.offset('wiggle')
				.values(function (d) {
					return d.values
				})


			areaFunc = d3
				.svg
				.area()
				.x(function (d) {
					return xScaleFunc(new Date(d.x))
				})
				.y0(function (d) {
					return yScaleFunc(d.y0)
				})
				.y1(function (d) {
					return yScaleFunc(d.y0 + d.y)
				})


			//console.log(layers)

			svg = d3
				.select('body')
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.attr('style', 'border: 1px solid gray')


			svg
				.selectAll('path')
				//.data(stackFunc(testData))
				.data(stackFunc(layers))
				.enter()
				.append('path')
				.attr("d", function (d) {
					return areaFunc(d.values)
				})
				.style("fill", function (d, i) {
					return colors[i]
				})

		}})
}()