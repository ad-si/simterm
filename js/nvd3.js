!function () {

	// TODO: Show timescale under steamgraph
	// TODO: Fix artefacts
	// TODO: Field to choose start and end datum
	// TODO: Intelligent scaling
	// TODO: Get max and min values from dataset
	// TODO: Write min and max to slider

	var $rangeSlider = $("#rangeSlider"),
		searchValue = 'Apple',
		firstLoad = true,
		minDate = new Date('2013-11-03'),
		maxDate = new Date('2013-12-10')


	function setSliderLabels(lower, upper) {

		var $upperSliderlabel = $rangeSlider.find('.noUi-handle-upper .sliderLabel'),
			$lowerSliderlabel = $rangeSlider.find('.noUi-handle-lower .sliderLabel')

		if (firstLoad) {

			$rangeSlider
				.find('.noUi-handle-lower')
				.append('<div class=sliderLabel></div>')
				.find('.sliderLabel')
				.attr('data-content', lower.substr(0, 10))

			$rangeSlider
				.find('.noUi-handle-upper')
				.append('<div class=sliderLabel></div>')
				.find('.sliderLabel')
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

		//if(new Date(selectedDate).getTime() > Number($rangeSlider.val()[0])){

		setSliderLabels(new Date(min).toJSON(), new Date(max).toJSON())
		loadData()

		//}

	}


	function renderChart(data) {

		var colors = d3.scale.category20(),
			keyColor = function (d, i) {
				return colors(d.key)
			},
			chart

		nv.addGraph(function () {

			chart = nv
				.models
				.stackedAreaChart()
				// .width(600)
				//.height(500)
				.useInteractiveGuideline(true)
				.x(function (d) {
					return d[0]
				})
				.y(function (d) {
					return d[1]
				})
				.color(keyColor)
				.transitionDuration(300)
			//.clipEdge(true)

			// chart.stacked.scatter.clipVoronoi(false)

			chart
				.xAxis
				.tickFormat(function (d) {
					return d3.time.format('%x')(new Date(d))
				})

			chart
				.yAxis
				.tickFormat(d3.format(',.2f'))

			d3
				.select('#nvd3Chart')
				.append('svg')
				.attr('id', 'nvd3Graph')
				.attr('height', 500)
				.datum(simterm.nvd3Data(data).nvd3layers())
				.transition()
				.duration(1000)
				.call(chart)
				// .transition()
				// .duration(0)
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
			// .each('end', function() {
			//         d3.selectAll('#chart1 *').each(function() {
			//           console.log('end', this.__transition__, this)
			//           // while(this.__transition__)
			//           if(this.__transition__)
			//             this.__transition__.duration = 1
			//         })})

			nv
				.utils
				.windowResize(chart.update)

			// chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); })

			return chart
		})
	}


	// TODO: layers vs nvd3layers

	$rangeSlider.noUiSlider({
		range: [minDate.getTime(), maxDate.getTime()],
		start: [minDate.getTime(), maxDate.getTime()],
		connect: true,
		slide: function () {

			var from = new Date(Number($rangeSlider.val()[0])).toJSON(),
				to = new Date(Number($rangeSlider.val()[1])).toJSON()

			setSliderLabels(from, to)
		},
		set: function () {

			$('#waity').css('display', 'block')

			var from = new Date(Number($rangeSlider.val()[0])).toJSON(),
				to = new Date(Number($rangeSlider.val()[1])).toJSON()

			simterm.loadData(
				{
					query: {
						keywords: searchValue,
						from: from,
						to: to
					}
				},
				function (data) {
					simterm
						.data(data)
						.render()

					$('#waity').hide()
				}
			)
		}
	})

	setSliderLabels(new Date(minDate).toJSON(), new Date(maxDate).toJSON())

	// TODO: On submit

	//console.log($('#filters'))


	$('#filters').submit(function (event) {

		console.log(event)

		//event.preventDefault()

		searchValue = keywords.value
		loadData()
	})


	$("#minTime")
		.attr('value', '2000-03-03')
		.attr('min', '2000-03-03')
		.attr('max', '2013-12-10')
		.on('change', setSliderMinMax)

	$("#maxTime")
		.attr('value', '2013-12-10')
		.attr('min', '2000-03-03')
		.attr('max', '2013-12-10')
		.on('change', setSliderMinMax)


	$('#filters')
		.find('label')
		.click(function (event) {

			var functionMap = {
				'streamgraphFilter': function(){simterm.config({offset: 'silhouette'})},
				'stackedAreaChartFilter': function(){simterm.config({offset: 'zero'})},
				'alphabeticalFilter': function(){simterm.config({sortOrder: 'alphabetical'})},
				'insideOutFilter': function(){simterm.config({sortOrder: 'inside-out'})},
				'sizeFilter': function(){simterm.config({sortOrder: 'size'})},
				'customFilter': function(){simterm.config({sortOrder: 'custom'})},
				'baseInterpolation': function(){simterm.config({interpolation: 'basis'})},
				'steppedInterpolation': function(){simterm.config({interpolation: 'step'})},
				'noInterpolation': function(){simterm.config({interpolation: 'none'})}
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

			$('#waity').hide()
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
		renderChart
	)

}()