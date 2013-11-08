var restify = require('restify'),
	fakesome = require('fakesome'),
	server = restify.createServer({
		name: 'TestServer',
		version: '0.0.1'
	})

/*function checkEquality(obj1, obj2) {

 if (Object.keys(obj1).length !== Object.keys(obj1).length)
 return false

 for (var i in obj1)
 if (obj1.hasOwnProperty(i) &&
 (!obj2.hasOwnProperty(i) || obj1[i] !== obj2[i]))
 return false

 return true
 }*/


server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.gzipResponse())
server.use(restify.CORS())


/*
 map.forEach(function (item) {

 server.get(baseURL + '/' + item.url, function (req, res, next) {


 var success = item.queries.some(function (query) {

 if (checkEquality(query.query, req.query)) {
 res.send(require('./testdata/' + query.file))
 return true
 }

 return false
 }),
 errorString = 'No data for the query ' +
 JSON.stringify(req.query) + ' available'

 if (!success)
 return next(new restify.ResourceNotFoundError(errorString))
 else
 return next()
 })
 })
 */


server.get('/simterm', function (req, res, next) {

	function bumpLayer(n) {

		function bump(a) {

			var x = 1 / (0.1 + Math.random()),
				y = 2 * Math.random() - .5,
				z = 10 / (0.1 + Math.random())

			for (var i = 0; i < n; i++) {

				var w = (i / n - y) * z

				a[i] += x * Math.exp(-w * w)
			}
		}

		var a = [],
			i

		for (i = 0; i < n; ++i)
			a[i] = 0

		for (i = 0; i < 5; ++i)
			bump(a)


		return a.map(function (d, i) {
			return {x: i, y: Math.max(0, d)}
		})
	}


	var test = {
		"term": "SAP",
		"associations": {
			"2013-10-10T22:00": [
				{
					name: "Hana",
					value: "0.4"
				},
				{
					name: "Hasso",
					value: "0.2"
				}
			],

			"2013-10-11T22:00": [
				{
					name: "Hana",
					value: "0.4"
				},
				{
					name: "Hasso",
					value: "0.2"
				}

			]
		}
	}

	test = fakesome.object({
		"term": "word()",
		"associations": fakesome.array(100).object({
			time: "2013-10-10T22:00",
			terms: fakesome.array(10).object({
				name: 'element(["hasso", "hana", "walldorf", "database", "in-memory"])',
				value: "float(0, 1)"
			})
		})
	})

	res.send(test)
})


server.listen(1234, function () {
	console.log('%s listening at %s', server.name, server.url)
})
