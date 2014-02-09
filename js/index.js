!function () {

	var $rangeSlider = $("#rangeSlider"),
		$search = $('#search'),
		$spinnerContainer = $('#spinnerContainer'),
		firstLoad = true,
		minDate = new Date('2013-11-03'),
		maxDate = new Date('2013-12-10')


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
					keywords: $search.find('input').val(),
					from: new Date(Number($rangeSlider.val()[0])).toJSON(),
					to: new Date(Number($rangeSlider.val()[1])).toJSON()
				}
			},
			function (data) {
				simterm
					.data(data)
					.render()

				simterm
					.nvd3Data(data)
					.renderNvd3()

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


	new Spinner().spin($spinnerContainer[0])

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

	$('#logo').click(function(event){

		event.preventDefault(true)

		location.reload(true)
	})


	// Initial rendering
	loadData()

}()