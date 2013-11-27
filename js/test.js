!function () {

	var numberOfLayers = 20,
		numberOfSamples = 200,
		width = 400,
		height = 300,
		stackFunc,
		areaFunc,
		svg,
		testData,
		layers,
		colors, xScaleFunc, yScaleFunc

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

		/*console.log('test:' + d3[type](layers[0].values.map(function (d) {
			return d.x
		})))

		console.log(layers[0].values.map(function (d) {
			return d.x
		}))

		console.log(layers[0])*/

		return new Date(d3[type](layers[0].values.map(function (d) {
			return d.x
		})))
	}


	$.ajax({
		//url: 'data/simterm.json',
		url: 'http://localhost:1234/simterm',
		success: function (data) {

			//var layers = []

			/*data = testData.map(function (dataArray) {
			 return dataArray.map(function (time) {
			 return {
			 x: xyArray[0],
			 y: xyArray[1]
			 }
			 })
			 })*/


			var layers = [],
				indexDict = {},
				stackedLayers

			// Map data to layer-style data
			data.associations.forEach(function (momentObject) {

				momentObject.terms.forEach(function (term) {

					// Create layer if not yet defined
					if (!indexDict[term.name]) {
						layers.push({
							name: term.name,
							values: []
						})

						indexDict[term.name] = layers.length
					}

					layers[indexDict[term.name]].values.push({
						x: momentObject.time,
						y: term.value,
						y0: 0
					})
				})
			})

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
				.domain([0, 1])
				.range([height, 0])


			stackFunc = d3
				.layout
				.stack()
				.offset('wiggle')
				.values(function (d) {
					return d.values
				})


			stackedLayers = stackFunc(layers)

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
			//console.log(data)

			//console.log(data)

			svg = d3
				.select('body')
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.attr('style', 'border: 1px solid gray')


			svg
				.selectAll('.layer')
				//.data(data)
				.data(stackedLayers)
				.enter()
				.append('path')
				.attr('class', 'layer')
				.attr("d", function (d) {
					console.log(d)
					return areaFunc(d.values)
				})
				.style("fill", function (d, i) {
					return colors[i]
				})

		}})
}()