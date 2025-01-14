function insertPoints(dbName, colName, xcount, ycount) {
	conn = new Mongo();
	dbase = conn.getDB(dbName);
    for(var i=1; i<=xcount; i++) {
        for(var j=1; j<=ycount; j++) {
           dbase[colName].insertOne({
               x : (i*2),
               y : (j*2)
           }); 
		   
        }
    }
}

function findNearest(dbName, colName, xval, yval) {
	conn = new Mongo();
	dbase = conn.getDB(dbName);
	var cursor = dbase[colName].find({});
	const array = cursor.toArray();
	var closest = [];
	closest[0] = xval;
	closest[1] = yval;
	var distance = 1000000000;
	var dist = 0;
	for(i=0; i<array.length; i++) {
		//console.log(array[i]['x']+" "+array[i]['y'])
		dist = Math.sqrt((xval-array[i]['x'])*(xval-array[i]['x'])
		+(yval-array[i]['y'])*(yval-array[i]['y']))
		if(dist < distance) {
			distance = dist;
			closest[0] = array[i]['x'];
			closest[1] = array[i]['y'];
		}
	}
	console.log("Closest: \n");
	console.log("X: "+closest[0]);
	console.log("Y: "+closest[1]);
	cursor.close()
}

function updateYVals(dbName, colName, threshold, incr) {
	conn = new Mongo();
	dbase = conn.getDB(dbName);
	dbase[colName].updateMany({
		y : {$gt:threshold}
	},
	{
		$inc:
		{
			y : incr
		}
	});
}

function removeIfYless(dbName, colName, threshold) {
	conn = new Mongo();
	dbase = conn.getDB(dbName);
	dbase[colName].deleteMany({
		y : {
			$lt : threshold
		}
	});
}

/*
use prac6db;
db.createCollection('Cartesian');
db.Cartesian.createIndex({x:1, y:1});

insertPoints('prac6db', 'Cartesian', 5, 5);
db.Cartesian.find();

findNearest('prac6db', 'Cartesian', 5, 7);

updateYVals('prac6db', 'Cartesian', 2, 10);
db.Cartesian.find();

removeIfYless('prac6db', 'Cartesian', 4);
db.Cartesian.find();
*/

/* 
C:\Users\liamb\Downloads\COS326\mongodb-database-tools-windows-x86_64-100.5.1\mongodb-database-tools-windows-x86_64-100.5.1\bin
mongoimport --db prac6db --collection zipcodes --drop --file "C:\Users\liamb\OneDrive\Documents\University\2021\Semester 2\COS326\Assigments\6\Files-for-Prac6\zipcodes.json"
mongoimport --db prac6db --collection facebookdata --drop --file "C:\Users\liamb\OneDrive\Documents\University\2021\Semester 2\COS326\Assigments\6\Files-for-Prac6\Facebookdata.json"*/
/*
db.zipcodes.aggregate([
{ $group: { _id: '$state', population: 
	{ $sum: '$pop' } } }, 
{ $sort: { "_id": 1 } }])
*/

function allStatesPopulation(dbName, colName) {
	conn = new Mongo();
	dbase = conn.getDB(dbName);
	var output = dbase[colName].aggregate([
	{ $group: 
		{ _id: '$state', population: { $sum: '$pop' } } }, 
	{ $sort: 
		{ "_id": 1 } }, 
	{ $project: 
		{_id: 0, state: '$_id', "population":'$population'}}
		]);
	printOutput(output);
}

function oneStatePopulation(dbName, colName, stateName) {
	conn = new Mongo();
	dbase = conn.getDB(dbName);
	var output = dbase[colName].aggregate([
	{ $match: 
		{state : stateName}},
	{ $group: 
		{ _id: '$state', population: { $sum: '$pop' } } }, 
	{ $sort: 
		{ "_id": 1 } }, 
	{ $project: 
		{_id: 0, state: '$_id', "population":'$population'}}
		]);
	printOutput(output);
}

/* MapReduce does the computation, aggregation is used for extra formatting*/
function allStatesPopulationMR(dbName, colName) {
	conn = new Mongo();
	dbase = conn.getDB(dbName);
	var output = dbase[colName].mapReduce( 
	function () {emit(this.state, this.pop);}, function (key, value) 
	{return Array.sum(value);}, 
	{
	/*finalize: function(key, red_val) {
		return {
			state: key,
			population: red_val
			}
		},*/
	sort: {"state":-1},
	out: "intermediate" }
	);
	dbase["intermediate"].aggregate([
	{$sort:
		{"_id":1}
		},
	{$project: {
		_id:0, state: '$_id', "population" : '$value' 
		}
	},
	{$out: "states_population"}
	])
	printOutput(dbase['states_population'].find({},{state:1, population:1, _id:0}));
	/*dbase["intermediate"].drop()*/
	console.log("Results Compiled to States Population");
}

function placesInGrid(dbName, colName, lat1, lat2, lon1, lon2) {
	conn = new Mongo();
	dbase = conn.getDB(dbName);
	var output = dbase[colName].aggregate([
	{
		$match : { $and : [
			{'loc.0':{$gt : lat1}},
			{'loc.0':{$lt : lat2}},
			{'loc.1':{$gt : lon1}},
			{'loc.1':{$lt : lon2}}
			]
		}
	},
	{
		$sort: { "state": 1 }
	},
	{
		$project:
			{
				_id:0, "zip_code" : "$_id", "City Name": "$city","location": "$loc",
				"state":"$state"
			}
	}
	]);
	printOutput(output);
}

function printOutput(output) {
	while(output.hasNext()) {
		printjson(output.next());
	}
}

/* allStatesPopulation('prac6db', 'zipcodes') */
/* oneStatePopulation('prac6db','zipcodes', 'NY') */
/* allStatesPopulationMR('prac6db', 'zipcodes') */
/* placesInGrid('prac6db', 'zipcodes', -72.505565,100,0,42)*/




