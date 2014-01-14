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

	$.get('/php/proxy.php', { //localost/~adrian/simterm/php/proxy.php', {
			csurl: 'http://www.blog-intelligence.com/XSEngine/XS_Search/steamgraph.xsjs',
			keywords: req.keywords,
			from: req.from,
			to: req.to
		},correctAndReturnData(d)
	)

	request.get('http://www.blog-intelligence.com/XSEngine/XS_Search/steamgraph.xsjs',
		{keywords: req.keywords,
			from: req.from,
			to: req.to},
			function(error, response, body){
				if(!error && response.statusCode == 200)
					correctAndReturnData(body)
			})


	function correctAndReturnData(data){
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

		console.log(req.query)

		var test = {
			term: "Apple",
			associations: [
				{
					time: 15718,
					terms: [
						{
							name: "Android",
							value: 1
						},
						{
							name: "Apple",
							value: 1
						},
						{
							name: "Samsung",
							value: 1
						},
						{
							name: "iPhone",
							value: 1
						}
					]
				},
				{
					time: 15719,
					terms: [
						{
							name: "Android",
							value: 23
						},
						{
							name: "Apple",
							value: 35
						},
						{
							name: "Samsung",
							value: 5
						},
						{
							name: "company",
							value: 2
						},
						{
							name: "iOS",
							value: 13
						},
						{
							name: "iPad",
							value: 32
						},
						{
							name: "iPhone",
							value: 27
						},
						{
							name: "iTunes",
							value: 5
						},
						{
							name: "product",
							value: 2
						}
					]
				},
				{
					time: 15720,
					terms: [
						{
							name: "Android",
							value: 15
						},
						{
							name: "Apple",
							value: 20
						},
						{
							name: "Samsung",
							value: 17
						},
						{
							name: "device",
							value: 1
						},
						{
							name: "iOS",
							value: 6
						},
						{
							name: "iPad",
							value: 13
						},
						{
							name: "iPhone",
							value: 24
						},
						{
							name: "iTunes",
							value: 5
						},
						{
							name: "product",
							value: 2
						}
					]
				},
				{
					time: 15721,
					terms: [
						{
							name: "Android",
							value: 32
						},
						{
							name: "Apple",
							value: 25
						},
						{
							name: "Samsung",
							value: 11
						},
						{
							name: "iOS",
							value: 15
						},
						{
							name: "iPad",
							value: 23
						},
						{
							name: "iPhone",
							value: 44
						},
						{
							name: "iPod",
							value: 2
						},
						{
							name: "iTunes",
							value: 10
						},
						{
							name: "iWatch",
							value: 1
						}
					]
				},
				{
					time: 15722,
					terms: [
						{
							name: "Android",
							value: 24
						},
						{
							name: "Apple",
							value: 28
						},
						{
							name: "Samsung",
							value: 5
						},
						{
							name: "company",
							value: 1
						},
						{
							name: "device",
							value: 1
						},
						{
							name: "iOS",
							value: 7
						},
						{
							name: "iPad",
							value: 21
						},
						{
							name: "iPhone",
							value: 18
						},
						{
							name: "iPod",
							value: 1
						},
						{
							name: "iTunes",
							value: 12
						},
						{
							name: "product",
							value: 1
						}
					]
				},
				{
					time: 15723,
					terms: [
						{
							name: "Android",
							value: 80
						},
						{
							name: "Apple",
							value: 39
						},
						{
							name: "Samsung",
							value: 8
						},
						{
							name: "company",
							value: 3
						},
						{
							name: "iOS",
							value: 26
						},
						{
							name: "iPad",
							value: 31
						},
						{
							name: "iPhone",
							value: 47
						},
						{
							name: "iTunes",
							value: 10
						},
						{
							name: "product",
							value: 2
						},
						{
							name: "tax",
							value: 1
						}
					]
				},
				{
					time: 15724,
					terms: [
						{
							name: "Android",
							value: 66
						},
						{
							name: "Apple",
							value: 45
						},
						{
							name: "Samsung",
							value: 14
						},
						{
							name: "iOS",
							value: 44
						},
						{
							name: "iPad",
							value: 10
						},
						{
							name: "iPhone",
							value: 23
						},
						{
							name: "iTunes",
							value: 5
						},
						{
							name: "product",
							value: 1
						}
					]
				},
				{
					time: 15725,
					terms: [
						{
							name: "Android",
							value: 13
						},
						{
							name: "Apple",
							value: 9
						},
						{
							name: "Samsung",
							value: 2
						},
						{
							name: "device",
							value: 1
						},
						{
							name: "iOS",
							value: 2
						},
						{
							name: "iPad",
							value: 6
						},
						{
							name: "iPhone",
							value: 7
						},
						{
							name: "product",
							value: 1
						}
					]
				},
				{
					time: 15726,
					terms: [
						{
							name: "Android",
							value: 33
						},
						{
							name: "Apple",
							value: 33
						},
						{
							name: "Samsung",
							value: 15
						},
						{
							name: "iOS",
							value: 15
						},
						{
							name: "iPad",
							value: 6
						},
						{
							name: "iPhone",
							value: 20
						},
						{
							name: "iPod",
							value: 4
						},
						{
							name: "iTunes",
							value: 3
						}
					]
				},
				{
					time: 15727,
					terms: [
						{
							name: "Android",
							value: 19
						},
						{
							name: "Apple",
							value: 39
						},
						{
							name: "Samsung",
							value: 11
						},
						{
							name: "device",
							value: 1
						},
						{
							name: "iOS",
							value: 17
						},
						{
							name: "iPad",
							value: 26
						},
						{
							name: "iPhone",
							value: 24
						},
						{
							name: "iPod",
							value: 2
						},
						{
							name: "iTunes",
							value: 11
						},
						{
							name: "product",
							value: 1
						}
					]
				},
				{
					time: 15728,
					terms: [
						{
							name: "Android",
							value: 30
						},
						{
							name: "Apple",
							value: 64
						},
						{
							name: "Samsung",
							value: 8
						},
						{
							name: "iOS",
							value: 7
						},
						{
							name: "iPad",
							value: 13
						},
						{
							name: "iPhone",
							value: 42
						},
						{
							name: "iPod",
							value: 2
						},
						{
							name: "iTunes",
							value: 9
						},
						{
							name: "product",
							value: 1
						}
					]
				},
				{
					time: 15729,
					terms: [
						{
							name: "Android",
							value: 21
						},
						{
							name: "Apple",
							value: 152
						},
						{
							name: "Cupertino",
							value: 1
						},
						{
							name: "Samsung",
							value: 9
						},
						{
							name: "company",
							value: 3
						},
						{
							name: "iOS",
							value: 7
						},
						{
							name: "iPad",
							value: 32
						},
						{
							name: "iPhone",
							value: 49
						},
						{
							name: "iPod",
							value: 4
						},
						{
							name: "iTunes",
							value: 11
						},
						{
							name: "product",
							value: 1
						}
					]
				},
				{
					time: 15730,
					terms: [
						{
							name: "Android",
							value: 53
						},
						{
							name: "Apple",
							value: 126
						},
						{
							name: "Cupertino",
							value: 1
						},
						{
							name: "Samsung",
							value: 10
						},
						{
							name: "company",
							value: 3
						},
						{
							name: "iOS",
							value: 20
						},
						{
							name: "iPad",
							value: 61
						},
						{
							name: "iPhone",
							value: 46
						},
						{
							name: "iPod",
							value: 3
						},
						{
							name: "iTunes",
							value: 2
						},
						{
							name: "product",
							value: 2
						}
					]
				},
				{
					time: 15731,
					terms: [
						{
							name: "Android",
							value: 18
						},
						{
							name: "Apple",
							value: 99
						},
						{
							name: "Cupertino",
							value: 2
						},
						{
							name: "Samsung",
							value: 37
						},
						{
							name: "iOS",
							value: 12
						},
						{
							name: "iPad",
							value: 7
						},
						{
							name: "iPhone",
							value: 15
						},
						{
							name: "iTunes",
							value: 15
						},
						{
							name: "profit",
							value: 1
						}
					]
				},
				{
					time: 15732,
					terms: [
						{
							name: "Android",
							value: 7
						},
						{
							name: "Apple",
							value: 33
						},
						{
							name: "Samsung",
							value: 7
						},
						{
							name: "company",
							value: 1
						},
						{
							name: "iOS",
							value: 8
						},
						{
							name: "iPad",
							value: 20
						},
						{
							name: "iPhone",
							value: 21
						},
						{
							name: "iPod",
							value: 2
						},
						{
							name: "iTunes",
							value: 14
						},
						{
							name: "product",
							value: 2
						}
					]
				},
				{
					time: 15733,
					terms: [
						{
							name: "Android",
							value: 34
						},
						{
							name: "Apple",
							value: 41
						},
						{
							name: "Cupertino",
							value: 1
						},
						{
							name: "Samsung",
							value: 2
						},
						{
							name: "iOS",
							value: 7
						},
						{
							name: "iPad",
							value: 39
						},
						{
							name: "iPhone",
							value: 24
						},
						{
							name: "iPod",
							value: 3
						},
						{
							name: "iTunes",
							value: 9
						},
						{
							name: "product",
							value: 1
						}
					]
				},
				{
					time: 15734,
					terms: [
						{
							name: "Android",
							value: 33
						},
						{
							name: "Apple",
							value: 33
						},
						{
							name: "Samsung",
							value: 15
						},
						{
							name: "company",
							value: 1
						},
						{
							name: "iOS",
							value: 16
						},
						{
							name: "iPad",
							value: 26
						},
						{
							name: "iPhone",
							value: 28
						},
						{
							name: "iPod",
							value: 2
						},
						{
							name: "iTunes",
							value: 7
						},
						{
							name: "product",
							value: 3
						}
					]
				},
				{
					time: 15735,
					terms: [
						{
							name: "Android",
							value: 42
						},
						{
							name: "Apple",
							value: 52
						},
						{
							name: "Samsung",
							value: 21
						},
						{
							name: "company",
							value: 1
						},
						{
							name: "iOS",
							value: 18
						},
						{
							name: "iPad",
							value: 57
						},
						{
							name: "iPhone",
							value: 50
						},
						{
							name: "iPod",
							value: 7
						},
						{
							name: "iTunes",
							value: 12
						},
						{
							name: "product",
							value: 2
						},
						{
							name: "taxes",
							value: 1
						}
					]
				},
				{
					time: 15736,
					terms: [
						{
							name: "Android",
							value: 25
						},
						{
							name: "Apple",
							value: 23
						},
						{
							name: "Samsung",
							value: 9
						},
						{
							name: "company",
							value: 1
						},
						{
							name: "iOS",
							value: 11
						},
						{
							name: "iPad",
							value: 21
						},
						{
							name: "iPhone",
							value: 22
						},
						{
							name: "iPod",
							value: 6
						},
						{
							name: "iTunes",
							value: 7
						},
						{
							name: "product",
							value: 1
						}
					]
				},
				{
					time: 15737,
					terms: [
						{
							name: "Android",
							value: 51
						},
						{
							name: "Apple",
							value: 72
						},
						{
							name: "Samsung",
							value: 19
						},
						{
							name: "company",
							value: 1
						},
						{
							name: "iOS",
							value: 10
						},
						{
							name: "iPad",
							value: 30
						},
						{
							name: "iPhone",
							value: 36
						},
						{
							name: "iPod",
							value: 2
						},
						{
							name: "iTunes",
							value: 5
						},
						{
							name: "product",
							value: 2
						},
						{
							name: "profit",
							value: 1
						}
					]
				},
				{
					time: 15738,
					terms: [
						{
							name: "Android",
							value: 28
						},
						{
							name: "Apple",
							value: 34
						},
						{
							name: "Samsung",
							value: 13
						},
						{
							name: "iOS",
							value: 31
						},
						{
							name: "iPad",
							value: 11
						},
						{
							name: "iPhone",
							value: 15
						},
						{
							name: "iPod",
							value: 1
						},
						{
							name: "iTunes",
							value: 6
						}
					]
				}
			]
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
		})*/

		function correctData(){
			var terms = []

			terms.push('iPhone', 'Samsung', 'Android', 'iTunes', 'iPod', 'Apple', 'iPad', 'iOS', 'profit', 'product', 'company', 'taxes', 'Cupertino', 'device', 'tax', 'iWatch')

			data.associations.forEach(function(assoc){
				terms.forEach(function(term){
					if(assoc.terms.filter(function(term2){
						return term2.name == term
					}).length < 1)
					{
						assoc.terms.push({name: term, value: 0})
					}
				})
			})
		}

		correctData()

		 data.associations.sort(function (a, b) {
		 return a.time - b.time
		 })


		 res.send(data)
	}

	//correctAndReturnData(0)


})

server.listen(1234, function () {
	console.log('%s listening at %s', server.name, server.url)
})
