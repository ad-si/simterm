!function () {

	var $rangeSlider = $("#rangeSlider"),
		$search = $('#search'),
		$spinnerContainer = $('#spinnerContainer'),
		searchValue = '',
		firstLoad = true,
		minDate = new Date('2013-11-03'),
		maxDate = new Date('2013-12-10'),
		nvd3FirstCall = true,
		nvd3Chart,
		spinner = new Spinner().spin($spinnerContainer[0])


	function setSliderLabels(lower, upper) {

		var $upperSliderlabel = $rangeSlider.find('.noUi-handle-upper .sliderLabel'),
			$lowerSliderlabel = $rangeSlider.find('.noUi-handle-lower .sliderLabel')

		if (firstLoad) {

			$('<div class=sliderLabel></div>')
				.appendTo($rangeSlider.find('.noUi-handle-lower'))
				.attr('data-content', lower.substr(0, 10))

			$('<div class=sliderLabel></div>')
				.appendTo($rangeSlider.find('.noUi-handle-upper'))
				.attr('data-content', upper.substr(0, 10))

		}
		else {

			$lowerSliderlabel.attr('data-content', lower.substr(0, 10))

			$upperSliderlabel.attr('data-content', upper.substr(0, 10))
		}

		$lowerSliderlabel.click(alert)
		$upperSliderlabel.click(alert)

		firstLoad = false
	}


	function loadData() {

		$spinnerContainer.show()

		simterm.loadData(
			{
				query: {
					keywords: searchValue,
					from: new Date(Number($rangeSlider.val()[0])).toJSON(),
					to: new Date(Number($rangeSlider.val()[1])).toJSON()
				}
			},
			function (data) {
				simterm
					.data(data)
					.render()

				renderChart(data)

				$spinnerContainer.hide()
			}
		)
	}


	function setSliderMinMax() {

		var min = $('#minTime').val(),
			max = $('#maxTime').val()

		firstLoad = true

		$rangeSlider.noUiSlider({
			range: [new Date(min).getTime(), new Date(max).getTime()]
		}, true)

		setSliderLabels(new Date(min).toJSON(), new Date(max).toJSON())
		loadData()
	}


	function renderChart(data) {


		function renderInitially() {

			var colors = d3.scale.category20(),
				keyColor = function (d, i) {
					return colors(d.key)
				}

			nv.addGraph(function () {

				nvd3Chart = nv
					.models
					.stackedAreaChart()
					.useInteractiveGuideline(true)
					.x(function (d) {
						return d[0]
					})
					.y(function (d) {
						return d[1]
					})
					.color(keyColor)
					.transitionDuration(300)


				nvd3Chart
					.xAxis
					.tickFormat(function (d) {
						return d3.time.format("%Y-%m-%d")(new Date(d))
					})

				nvd3Chart
					.yAxis
					.tickFormat(d3.format(',.2f'))

				d3
					.select('#nvd3Chart')
					.append('svg')
					.attr('id', 'nvd3Graph')
					.datum(simterm.nvd3Data(data).nvd3layers())
					.transition()
					.duration(1000)
					.call(nvd3Chart)

/*

				nv
					.utils
					.windowResize(nvd3Chart.update)
*/


				// .transition()
				// .duration(0)
				/*
				 .each('start', function () {
				 setTimeout(function () {
				 d3
				 .selectAll('#nvd3Graph *')
				 .each(function () {
				 //console.log('start', this.__transition__, this)
				 // while(this.__transition__)
				 if (this.__transition__)
				 this.__transition__.duration = 1
				 })
				 }, 0)
				 })
				 */

				// .each('end', function() {
				//         d3.selectAll('#chart1 *').each(function() {
				//           console.log('end', this.__transition__, this)
				//           // while(this.__transition__)
				//           if(this.__transition__)
				//             this.__transition__.duration = 1
				//         })})

				//nv
				//	.utils
				//	.windowResize(nvd3Chart.update)

				// chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); })

				return nvd3Chart
			})
		}

		function updateRendering() {

			d3
				.select('#nvd3Graph')
				.datum(simterm.nvd3Data(data).nvd3layers())
				.transition()
				.duration(1000)
				.call(nvd3Chart)
		}


		if (nvd3FirstCall) {
			renderInitially()
			nvd3FirstCall = false
		}
		else {
			updateRendering()
			//changeOrder(layers)
		}
	}


	$spinnerContainer.append(spinner.el)

	$rangeSlider.noUiSlider({
		range: [minDate.getTime(), maxDate.getTime()],
		start: [minDate.getTime(), maxDate.getTime()],
		connect: true,
		slide: function () {

			var from = new Date(Number($rangeSlider.val()[0])).toJSON(),
				to = new Date(Number($rangeSlider.val()[1])).toJSON()

			setSliderLabels(from, to)
		},
		set: loadData
	})

	setSliderLabels(new Date(minDate).toJSON(), new Date(maxDate).toJSON())


	$search.submit(function (event) {

		event.preventDefault()

		console.log(spinner)

		searchValue = $search.find('input').val()

		loadData()
	})


	$("#minTime")
		.attr('value', minDate.toISOString().substr(0,10))
		.attr('min', '2000-01-01')
		.attr('max', '2014-01-01')
		.on('change', setSliderMinMax)

	$("#maxTime")
		.attr('value', maxDate.toISOString().substr(0,10))
		.attr('min', '2000-01-01')
		.attr('max', '2014-01-01')
		.on('change', setSliderMinMax)


	$('#filters')
		.find('label')
		.click(function () {

			var functionMap = {
				streamgraphFilter: function () {
					simterm.config({offset: 'silhouette'})
				},
				stackedAreaChartFilter: function () {
					simterm.config({offset: 'zero'})
				},
				alphabeticalFilter: function () {
					simterm.config({sortOrder: 'alphabetical'})
				},
				insideOutFilter: function () {
					simterm.config({sortOrder: 'inside-out'})
				},
				sizeFilter: function () {
					simterm.config({sortOrder: 'size'})
				},
				customFilter: function () {
					simterm.config({sortOrder: 'custom'})
				},
				baseInterpolation: function () {
					simterm.config({interpolation: 'basis'})
				},
				steppedInterpolation: function () {
					simterm.config({interpolation: 'step'})
				},
				noInterpolation: function () {
					simterm.config({interpolation: 'none'})
				}
			}

			functionMap[$(this).find('input').attr('id')].call()

			simterm.render()
		})


	// Event listener for filters
	$('.btn')
		.button()
		.on('change', function () {

			$(this)
				.find('input')
				.val()
		})

	searchValue = $search.find('input').val()

	// Initial d3 rendering
	simterm.loadData(
		{
			query: {
				keywords: searchValue,
				from: minDate.toJSON(),
				to: maxDate.toJSON()
			}
		},
		function (data) {
			simterm
				.data(data)
				.render()
		}
	)

	// Initial nvd3 rendering
	simterm.loadData(
		{
			query: {
				keywords: searchValue,
				from: minDate.toJSON(),
				to: maxDate.toJSON()
			}
		},
		function(data){

			renderChart(data)

			$spinnerContainer.hide()
		}
	)

}()