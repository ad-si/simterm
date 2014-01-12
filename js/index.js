!function () {

	var $rangeSlider = $("#rangeSlider"),
		firstLoad = true


	//TODO: get max and min values from dataset
	var min = new Date('1970-03-03').getTime(),
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

			$('#waity').css('display', 'block')

			var from = new Date(Number($rangeSlider.val()[0])).toJSON(),
				to = new Date(Number($rangeSlider.val()[1])).toJSON()

			simterm.loadData(function(data){
				simterm
					.data(data)
					.render()

				$('#waity').hide()
			}, {query: {from: from, to: to}}
			)
		}
	})

	setSliderLabels(new Date(min).toJSON(), new Date(max).toJSON())


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
	})

	$('.btn')
		.button()
		.on('change', function () {

			$(this)
				.find('input')
				.val()
		})


}()