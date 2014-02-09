# Simterm

Visualization of similar terms over time


## Getting started

1. Install [nodejs](http://nodejs.org/) and [npm](https://npmjs.org/) (included in nodejs) on your machine
1. Clone the repository: `git clone https://github.com/adius/simterm.git && cd simterm`
1. `npm install` to install the dependencies listed in package.json
1. To use the server module as a proxy for the hana-db set the variable "testMode" in server.js to false.
	To deliver dynamically generated test-data set it to true.
	Now start the server module with node.js: `node server.js`
1. Open the index.html file in a browser (preferably Chrome)

It should now display the Simterm-UI and load the default graph.
