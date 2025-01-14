const mongoClient = require("mongodb").MongoClient
const uri = "mongodb://localhost:27017/prac6"
//const client = new mongoClient(uri)

mongoClient.connect(uri, function(err, db) {
    if(err) throw err;

    dbPrac = db.db("prac6")
    prac = pracDB.collection("prac")

    db.close();
})

function insertPoints(dbName, colName, xcount, ycount) {
    for(let i=1; i<xcount; i++) {
        for(let j=1; j<ycount; j++) {
            dbName.colName.insert({
                x : (i*2),
                y : (j*2)
            });
        }
    }
}
