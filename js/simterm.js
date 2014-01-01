!function () {

	var simterm = {},
		width = 800,
		height = 400,
		colors = ['coral', 'chocolate', 'yellow', 'firebrick', 'orange', 'red', 'purple', 'indianred', 'crimson', 'tomato'],
		firstCall = true,
		svg


	/*var color = d3
	 .scale
	 .linear()
	 .range(["red", "green"])*/


	simterm.loadData = function (callback, urlObject) {

		var urlObj = {
				protocol: 'http:',
				host: '//localhost:1234',
				pathname: '/simterm'
			},
			search = ''

		$.extend(urlObj, urlObject)


		if (urlObj.query) {

			search = '?'

			for (var key in urlObj.query) {
				if (urlObj.query.hasOwnProperty(key)) {

					search += key + '=' + urlObj.query[key] + '&'
				}
			}
		}

		var url = urlObj.protocol + urlObj.host + urlObj.pathname + search


		$.ajax({
			url: url,
			error: function (data) {
				throw data
			},
			success: function (data) {
				callback(data)
			}
		})
	}

	simterm.render = function (data) {

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

		function convertData(data) {

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
				.duration(2000)
				.attr("d", function (d) {
					return areaFunc(d.values)
				})
		}

		function renderInitially(layers) {

			svg = d3
				.select('#streamgraph')
				.append('svg')
				.attr('width', width)
				.attr('height', height)

			var group = svg
				.selectAll('path')
				.data(stackFunc(layers))
				.enter()
				.append('g')


			group
				.append('path')
				.attr("d", function (d) {
					return areaFunc(d.values)
				})
				.style("fill", function (d, i) {
					return colors[i]
				})
				.on('click', function(datum, index){

					d3.event.stopPropagation()

					$('.streamgraphPopup')
						.remove()

					var $popup = $('<div class="streamgraphPopup"></div>')
						.text(datum.name)
						.click(function(event){
							event.stopPropagation()
						})
						.css('top', d3.event.pageY)
						.css('left', d3.event.pageX)
						.appendTo(document.body)

					$('body').click(function(){
						$popup.remove()
					})

					console.log(d3.event)
				})
			/* TODO: Think of a meaningful coloring algorithm
			.style("fill", function () {
			 return color(Math.random())
			 })*/

			group
				.append('title')
				.text(function (d) {
					return d.name
				})

		}

		function renderChangedOrder(layers) {

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
			//.order('inside-out')
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


		if (firstCall) {
			renderInitially(layers)
			firstCall = false
		}
		else {
			updateRendering(layers)
			//changeOrder(layers)
		}
	}



	window.simterm = simterm

}()