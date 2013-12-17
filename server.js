var restify = require('restify'),
	fakesome = require('fakesome'),
	server = restify.createServer({
		name: 'TestServer',
		version: '0.0.1'
	}),
	numberOfSamples = 15,
	numberOfTerms = 5


server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.gzipResponse())
server.use(restify.CORS())


server.get('/simterm', function (req, res, next) {

	var counter = 0


	function getTerm(){

		var reset = false

		if(counter % numberOfTerms == 0)
			reset = true

		var value = fakesome
			.unique(reset)
			//.element(["hasso", "hana", "walldorf", "database", "in-memory", "a", "b", "c", "d", "e"])
			.element(["hasso", "hana", "walldorf", "database", "in-memory"])

		counter++

		return value
	}


	var	test = fakesome.object({
		"term": "SAP",
		"associations": fakesome.array(numberOfSamples).object({
			time: "date()",
			terms: function(){
				return fakesome.array(numberOfTerms).object({
					name: function(){
						return getTerm()
					},
					value: "float(0, 1)"
				})
			}
		})
	})

	test.associations.sort(function(a, b){
		return a.time - b.time
	})

	res.send(test)
})


server.listen(1234, function () {
	console.log('%s listening at %s', server.name, server.url)
})
