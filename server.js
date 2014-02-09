var restify = require('restify'),
	fakesome = require('fakesome'),
	request = require('request'),
	url = require('url'),
	queryString = require('querystring'),

	numberOfTerms = 5,
	server = restify.createServer({
		name: 'TestServer',
		version: '0.0.1'
	}),
	client = restify.createJsonClient({
		url: 'http://www.blog-intelligence.com'
	}),
	requestUrl = {
		protocol: 'http',
		host: 'www.blog-intelligence.com',
		pathname: '/XSEngine/XS_Search/steamgraph.xsjs'
	},
	testMode = false,
	counter = 0


function returnTestData(request) {

	var data

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


	data = fakesome.object({
		"term": request.query.keywords,
		"associations": fakesome
			.array(fakesome.integer(10, 100))
			.object({
				time: function () {
					return fakesome.date(request.query.from, request.query.to)
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

	data.modifier = 1

	data.associations.sort(function (a, b) {
		return a.time - b.time
	})

	return data
}


server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.gzipResponse())
server.use(restify.CORS())


server.get('/simterm', function (req, res) {

	function correctData(data) {

		var terms = {}

		//calculate
		data.modifier = data.associations.map(function (assoc) {
			return assoc.terms.map(function (term) {
				return Number(term.value)
			}).reduce(function (p, c, i, arr) {
					return Math.max(p, c)
				})
		}).reduce(function (p, c, i, arr) {
				return Math.max(p, c)
			}) / 6

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

		return data
	}


	if (testMode)
		res.send(returnTestData(req))

	else {

		requestUrl.query = {
			keywords: req.query.keywords,
			from: new Date(req.query.from).getTime(),
			to: new Date(req.query.to).getTime()
		}

		client.get(

			requestUrl.pathname + '?' + queryString.stringify(requestUrl.query),

			function (error, request, response, obj) {

				if (error) throw error

				res.send(correctData(obj))
			}
		)
	}

})


server.listen(1234, function () {
	console.log('%s listening at %s', server.name, server.url)
})
