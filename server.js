var restify = require('restify'),
	request = require('request'),
	fakesome = require('fakesome'),
	server = restify.createServer({
		name: 'TestServer',
		version: '0.0.1'
	}),
	numberOfTerms = 5


server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.gzipResponse())
server.use(restify.CORS())


server.get('/simterm', function (req, res, next) {


	function correctAndReturnData(data) {

			var counter = 0,
				numberOfSamples = 15

			function getTerm() {

				var reset = false

				if (counter % numberOfTerms == 0)
					reset = true

				var value = fakesome
					.unique(reset)
					//.element(["hasso", "hana", "walldorf", "database", "in-memory", "a", "b", "c", "d", "e"])
					.element(["hasso", "hana", "walldorf", "database", "in-memory"])

				counter++

				return value
			}

			/*var test = fakesome.object({
			 "term": "SAP",
			 "associations": fakesome.array(fakesome.integer(10,100)).object({
			 time: function () {
			 return fakesome.date(req.query.from, req.query.to)
			 },
			 terms: function () {
			 return fakesome.array(numberOfTerms).object({
			 name: function () {
			 return getTerm()
			 },
			 value: "float(0, 1)"
			 })
			 }
			 })
			 })
			 test.modifier = 1.0*/

			function correctData() {

				var terms = {}

				//calculate
				data.modifier = data.associations.map(function(assoc){
					return assoc.terms.map(function (term){
						return Number(term.value)
					}).reduce(function(p, c, i, arr){
						return Math.max(p, c)
					})
				}).reduce(function (p, c, i, arr){
						return Math.max(p, c)
				}) / 6

				console.log(data.modifier)

				//create an array of all terms contained by data

				data.associations.forEach(function (association) {
					association.terms.forEach(function (term) {
						terms[term.name] = true
					})
				})

				//for each terms array in data add all not contained terms for consistency

				data.associations.forEach(function (assoc) {
					Object.keys(terms).forEach(function (term) {
						if (assoc.terms.filter(function (term2) {
							return term2.name == term
						}).length < 1) {
							assoc.terms.push({name: term, value: 0})
						}
					})
				})
			}

			correctData()

			/*data.associations.sort(function (a, b) {
				return a.time - b.time
			})*/

			res.send(data)

	}


	request.get(
		{
			uri: 'http://www.blog-intelligence.com/XSEngine/XS_Search/steamgraph.xsjs',
			qs: {
						keywords: req.query.keywords,
						from: new Date(req.query.from).getTime(),
						to: new Date(req.query.to).getTime()}
		},
		function (error, response, body) {

			if (error)
				throw error

			//console.log(JSON.parse(body).associations[1].terms)
			//console.dir(JSON.parse(body))
			correctAndReturnData(JSON.parse(body))
		}

	)

})

server.listen(1234, function () {
	console.log('%s listening at %s', server.name, server.url)
})
