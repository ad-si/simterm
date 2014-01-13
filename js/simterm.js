!function () {

	var simterm = {},
		width = 800,
		height = 400,
		colors = ['coral', 'chocolate', 'yellow', 'firebrick', 'orange', 'red', 'purple', 'indianred', 'crimson', 'tomato'],
		firstCall = true,
		svg,
		layers = [],
		config = {
			sortOrder: 'inside-out',
			interpolation: 'basis',
			offset: 'silhouette'
		},
		sortingFuncs = {
			'inside-out': 'inside-out',
			alphabetical: function (data) {

				var keys = [],
					referenceKeys = []

				layers.forEach(function (layer) {
					keys.push(layer.name)
					referenceKeys.push(layer.name)
				})

				return keys.sort().map(function (key) {
					return referenceKeys.indexOf(key)
				}).reverse()
			},
			size: function (data) {

			}
		}


	simterm.config = function (configObject) {

		$.extend(config, configObject)

		return this
	}

	simterm.loadData = function (callback, urlObject) {

		var urlObj = {
				protocol: 'http:',
				host: '//localhost:1234',
				pathname: '/simterm'
				//host: '//www.blog-intelligence.com/XSEngine/XS_Search',
				//pathname: '/steamgraph.xsjs'

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

	simterm.data = function (data) {

		var indexDict = {}

		layers = []

		data.associations.forEach(function (momentObject) {

			momentObject.terms.forEach(function (term) {


				// Create layer if not yet defined
				if (indexDict[term.name] === undefined) {
					layers.push({
						name: term.name,
						values: []
					})

					indexDict[term.name] = layers.length - 1
				}

				layers[indexDict[term.name]].values.push({
					//x: momentObject.time,
					//y: term.value
					x: new Date(momentObject.time),
					y: eval('1 / ' + term.value)
				})
			})
		})


		return this
	}

	simterm.render = function () {

		var svg,
			xScaleFunc,
			yScaleFunc,
			areaFunc,
			stackFunction

		stackFunction = d3
			.layout
			.stack()
			.order(sortingFuncs[config.sortOrder])
			.offset(config.offset)
			.values(function (d) {
				return d.values
			})


		areaFunc = d3
			.svg
			.area()
			.interpolate(config.interpolation)
			.x(function (d) {
				return xScaleFunc(new Date(d.x))
			})
			.y0(function (d) {
				return yScaleFunc(d.y0)
			})
			.y1(function (d) {
				return yScaleFunc(d.y0 + d.y)
			})


		function getMinMax(type) {

			return new Date(d3[type](layers[0].values.map(function (d) {
				return d.x
			})))
		}

		function updateRendering() {

			d3
				.selectAll("path")
				.data(stackFunction(layers))
				.transition()
				.duration(500)
				.attr("d", function (d) {
					return areaFunc(d.values)
				})
		}

		function updateRendering2() {

			/*d3
			 .selectAll("path")
			 .data(stackFunction(layers))
			 //.transition()
			 //.duration(800)
			 .attr("d", function (d) {
			 return areaFunc(d.values)
			 })
			 //console.log(layers)

			 var tempLayers = []

			 function () {


			 layers.forEach(function(layer){

			 layer.values.forEach(function (value) {

			 value.y = 0

			 return value
			 })

			 return layer
			 })

			 return layers

			 }()
			 */


			d3
				.selectAll("path")
				.data(stackFunction(layers))
				.transition()
				.duration(500)
				.attr("d", function (d) {

					return areaFunc(d.values.map(function (value) {
						return {
							x: value.x,
							y: 0,
							y0: 0
						}
					}))
				})
				.transition()
				.duration(800)
				.attr("d", function (d) {
					return areaFunc(d.values)
				})
		}

		function renderInitially() {

			svg = d3
				.select('#graphWrapper')
				.append('svg')
				.attr('id', 'streamgraph')
				.attr('width', width)
				.attr('height', height)

			console.log(layers)
			var group = svg
				.selectAll('path')
				.data(stackFunction(layers))
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
				.on('click', function (datum, index) {

					d3.event.stopPropagation()

					$('.streamgraphPopup')
						.remove()

					var $popup = $('<div class="streamgraphPopup"></div>')
						.text(datum.name)
						.click(function (event) {
							event.stopPropagation()
						})
						.css('top', d3.event.pageY)
						.css('left', d3.event.pageX)
						.appendTo(document.body)

					$('html').click(function () {
						$popup.remove()
					})

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

		function renderChangedOrder() {

			var stackFunc2 = d3
				.layout
				.stack()
				.order('inside-out')
				//.offset('silhouette')
				//.offset('zero')
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


		xScaleFunc = d3
			.time
			.scale()
			.domain([getMinMax('min'), getMinMax('max')])
			.range([0, width])


		yScaleFunc = d3
			.scale
			.linear()
			.domain([0, layers.length])
			.range([height, 0])


		if (firstCall) {
			renderInitially()
			firstCall = false
		}
		else {
			updateRendering()
			//changeOrder(layers)
		}

		return this
	}

	/*simterm.convertToAreaChart = function () {

	 var stackedAreaChartFunc = d3
	 .layout
	 .stack()
	 //.order('inside-out')
	 .offset('zero')
	 .values(function (d) {
	 return d.values
	 })


	 d3
	 .selectAll("path")
	 .data(stackedAreaChartFunc(layers))
	 .transition()
	 .duration(500)
	 .attr("d", function (d) {
	 return areaFunc(d.values)
	 })
	 }*/


	window.simterm = simterm

}()


//simterm
//	.loadData()
//	.