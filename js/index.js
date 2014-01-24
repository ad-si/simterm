!function () {


	/*  TODO:   - show timescale under steamgraph
	 - fix artefacts
	 - field to choose start and end datum
	 - intelligent scaling
	 */

	var $rangeSlider = $("#rangeSlider"),
		searchValue = 'Apple',
		firstLoad = true,

	//TODO: get max and min values from dataset
		min = new Date('2000-03-03').getTime(),
		max = new Date('2013-12-10').getTime()

	//minTime.value = new Date(min).toJSON().substr(0,10)
	//maxTime.value = new Date(max).toJSON().substr(0,10)

	//TODO: write min and max to slider

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
			function (data) {
				simterm
					.data(data)
					.render()
			},
			{
				query: {
					keywords: searchValue,
					from: new Date(Number($rangeSlider.val()[0])).toJSON(),
					to: new Date(Number($rangeSlider.val()[1])).toJSON()
				}
			}
		)
	}


	$rangeSlider.noUiSlider({
		range: [min, max],
		start: [min, max],
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

			simterm.loadData(function (data) {
					simterm
						.data(data)
						.render()

					$('#waity').hide()
				}, {query: {keywords: searchValue, from: from, to: to}}
			)
		}
	})

	setSliderLabels(new Date(min).toJSON(), new Date(max).toJSON())

	keywords.addEventListener('keypress', function (event) {
		if (event.keyCode == 13) {
			searchValue = keywords.value
			loadData()
		}
	}, false)


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

	/*
	 $("#minTime").datepicker({
	 changeYear: true,
	 changeMonth: true,
	 numberOfMonths: 1,
	 maxDate: new Date(max-1),
	 dateFormat: "dd.mm.yy",
	 onSelect: function (selectedDate) {
	 min = new Date(selectedDate).getTime()
	 minTime.value = new Date(selectedDate).toJSON().substr(0, 10)
	 firstLoad = true
	 $rangeSlider.noUiSlider({
	 range: [min, max]
	 }, true)

	 if(new Date(selectedDate).getTime() > Number($rangeSlider.val()[0]))
	 {
	 setSliderLabels(new Date(min).toJSON(), new Date(max).toJSON())
	 loadData()
	 }
	 }
	 })

	 $("#maxTime").datepicker({
	 changeYear: true,
	 changeMonth: true,
	 numberOfMonths: 1,
	 minDate: new Date(min+1),
	 maxDate: 0,
	 dateFormat: "dd.mm.yy",
	 onSelect: function (selectedDate) {
	 max = new Date(selectedDate).getTime()
	 maxTime.value = new Date(selectedDate).toJSON().substr(0, 10)
	 firstLoad = true
	 $rangeSlider.noUiSlider({
	 range: [min, max]
	 }, true)

	 if(new Date(selectedDate).getTime() < Number($rangeSlider.val()[1]))
	 {
	 setSliderLabels(new Date(min).toJSON(), new Date(max).toJSON())
	 loadData()
	 }
	 }
	 })
	 */


	$('#filters')
		.find('label')
		.click(function (event) {


			switch ($(this).find('input').attr('id')) {
				case 'streamgraphFilter':
					simterm
						.config({
							offset: 'silhouette'
						})
						.render()
					break
				case 'stackedAreaChartFilter':
					simterm
						.config({
							offset: 'zero'
						})
						.render()
					break


				case 'alphabeticalFilter':
					simterm
						.config({
							sortOrder: 'alphabetical'
						})
						.render()
					break
				case 'insideOutFilter':
					simterm
						.config({
							sortOrder: 'inside-out'
						})
						.render()
					break
				case 'sizeFilter':
					simterm
						.config({
							sortOrder: 'size'
						})
						.render()
					break
				case 'customFilter':
					simterm
						.config({
							sortOrder: 'custom'
						})
						.render()
					break


				case 'baseInterpolation':
					simterm
						.config({
							interpolation: 'basis'
						})
						.render()
					break
				case 'steppedInterpolation':
					simterm
						.config({
							interpolation: 'step'
						})
						.render()
					break
				case 'noInterpolation':
					simterm
						.config({
							interpolation: 'none'
						})
						.render()
					break
				default:
					alert('No such option')
			}
		})

	$('#update').click(function () {

		simterm.loadData(function (data) {
			simterm
				.data(data)
				.render()
		})
	})


	simterm.loadData(function (data) {
		simterm
			.data(data)
			.render()

		$('#waity').hide()
	}, {query: {keywords: searchValue, from: new Date(min).toJSON(), to: new Date(max).toJSON()}})

	$('.btn')
		.button()
		.on('change', function () {

			$(this)
				.find('input')
				.val()
		})


}()