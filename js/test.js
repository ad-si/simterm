!function () {

	var numberOfLayers = 20,
		numberOfSamples = 200,
		width = 800,
		height = 400,
		colors = ['coral', 'chocolate', 'yellow', 'firebrick', 'orange'],
		firstCall = true,
		stackFunc,
		areaFunc,
		svg,
		testData,
		xScaleFunc,
		yScaleFunc


	function loadData(callback){

		$.ajax({
			url: 'http://localhost:1234/simterm',
			error: function(data){
				throw data
			},
			success: function(data){
				callback(data)
			}
		})
	}

	function render(data){

		var svg,
			indexDict = {},
			layers,
			xScaleFunc,
			yScaleFunc,
			stackFunc,
			areaFunc


		function getMinMax(layers, type) {

			return new Date(d3[type](layers[0].values.map(function (d) {
				return d.x
			})))
		}

		function convertData (data) {

			var layers = []

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

			return layers
		}

		function updateRendering(layers) {

			d3
				.selectAll("path")
				.data(stackFunc(layers))
				.transition()
				.duration(2500)
				.attr("d", function (d) {
					console.log(d.values)
					return areaFunc(d.values)
				})
		}

		function renderInitially(layers){

			svg = d3
				.select('body')
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.attr('style', 'border: 1px solid gray')

			svg
				.selectAll('path')
				.data(stackFunc(layers))
				.enter()
				.append('path')
				.attr("d", function (d) {
					return areaFunc(d.values)
				})
				.style("fill", function (d, i) {
					return colors[i]
				})

		}

		function renderChangedOrder(layers){

			var stackFunc2 = d3
				.layout
				.stack()
				.order('inside-out')
				.offset('silhouette')
				.values(function (d) {
					return d.values
				})


			d3
				.selectAll("path")
				.data(layers)
				.transition()
				.duration(2500)
				.attr("d", function (d) {
					console.log(d.values)
					return areaFunc(d.values)
				})
		}


		layers = convertData(data)

		xScaleFunc = d3
			.time
			.scale()
			.domain([getMinMax(layers, 'min'), getMinMax(layers, 'max')])
			.range([0, width])


		yScaleFunc = d3
			.scale
			.linear()
			.domain([0, layers.length])
			.range([height, 0])

		stackFunc = d3
			.layout
			.stack()
			.order('inside-out')
			.offset('silhouette')
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


		if(firstCall){
			renderInitially(layers)
			firstCall = false
		}
		else{
			updateRendering(layers)
			//changeOrder(layers)
		}
	}


	$('#update').click(function(){

		//render()

		loadData(render)
	})

	loadData(render)
}()