!function () {

	var $rangeSlider = $("#rangeSlider")


	//TODO: get max and min values from dataset
	var min = new Date('2003-03-03').getTime(),
		max = new Date('2010-10-10').getTime()


	$rangeSlider.noUiSlider({
		range: [min, max],
		start: [min, max],
		connect: true,
		set: function(){

			var from = new Date(Number($rangeSlider.val()[0])).toJSON(),
				to = new Date(Number($rangeSlider.val()[1])).toJSON()

			simterm.loadData(simterm.render, {query: {from: from, to: to}})
		}
	})



	$('#update').click(function () {

		simterm.loadData(simterm.render)
	})

	/*d3
	 .select('#update')
	 .on('click', function(){

	 loadData(render)
	 })*/

	simterm.loadData(simterm.render)

}()