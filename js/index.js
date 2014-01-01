!function () {

	var $rangeSlider = $("#rangeSlider"),
		firstLoad = true


	//TODO: get max and min values from dataset
	var min = new Date('2003-03-03').getTime(),
		max = new Date('2010-10-10').getTime()

	//TODO: write min and max to slider

	function setSliderLabels(lower, upper) {

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

			$rangeSlider
				.find('.noUi-handle-lower .sliderLabel')
				.attr('data-content', lower.substr(0, 10))

			$rangeSlider
				.find('.noUi-handle-upper .sliderLabel')
				.attr('data-content', upper.substr(0, 10))
		}

		firstLoad = false
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

			var from = new Date(Number($rangeSlider.val()[0])).toJSON(),
				to = new Date(Number($rangeSlider.val()[1])).toJSON()

			simterm.loadData(simterm.render, {query: {from: from, to: to}})
		}
	})

	setSliderLabels(new Date(min).toJSON(), new Date(max).toJSON())

	$('#update').click(function () {

		simterm.loadData(simterm.render)
	})

	simterm.loadData(simterm.render)

}()