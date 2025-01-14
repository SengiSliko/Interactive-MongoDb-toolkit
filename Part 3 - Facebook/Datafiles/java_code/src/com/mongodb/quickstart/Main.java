package com.mongodb.quickstart;
import static com.mongodb.client.model.Aggregates.*;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.*;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import org.bson.BsonNull;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.json.JsonWriterSettings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.function.Consumer;

import com.mongodb.client.model.Indexes;
import com.mongodb.client.model.IndexOptions;

public class Main {

    private static ConnectionString connString = new ConnectionString(
      "mongodb://localhost"
    );

    private static MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(connString)
            .retryWrites(true)
            .build();

    private static MongoClient mongoClient = MongoClients.create(settings);
    private static MongoDatabase database = mongoClient.getDatabase("prac6db");

    public static void main(String[] args) {
        /////////////////////////////////////////////////////////////////////
        /* Question 1 */
        MongoIterable<String> collections = database.listCollectionNames();
        MongoCursor<String> cursor = collections.iterator();
        while(cursor.hasNext()) {
            System.out.println(cursor.next());
        }
        /////////////////////////////////////////////////////////////////////
        /* Question 2 */
        MongoCollection<Document> doc = database.getCollection("facebookdata");
        Bson unw = unwind("$data");
        List<Document> output = doc.aggregate(Arrays.asList(unw)).into(new ArrayList<>());
        output.forEach(printOutput());

        /////////////////////////////////////////////////////////////////////
        /* Question 3 */

        Bson cou = count("message");
        output = doc.aggregate(Arrays.asList(new Document("$unwind",
                        new Document("path", "$data")),
                new Document("$match",
                        new Document("data.message",
                                new Document("$ne",
                                        new BsonNull()))),
                new Document("$count", "messages"))).into(new ArrayList<>());
        output.forEach(printOutput());

        /////////////////////////////////////////////////////////////////////
        /* Question 4 */
        MongoCollection mess = database.getCollection("messages");
        mess.createIndex(Indexes.text("message"));
        List<Document> output2 = doc.aggregate(Arrays.asList(new Document("$unwind",
                        new Document("path", "$data")),
                new Document("$project",
                        // 1L for include, 0L for exclude
                        new Document("data", 1L)
                                .append("_id", 0L)
                                .append("from", "$data.from")
                                .append("message", "$data.message")),
                new Document("$project",
                        new Document("from", 1L)
                                .append("message", 1L)),
                new Document("$out", "messages"))).into(new ArrayList<>());
        output2.forEach(printOutput());

        /////////////////////////////////////////////////////////////////////
        /* Question 5 */
        MongoIterable<String> iter2 = mess.find(Filters.text("spring september"));
        MongoCursor<String> cursor2 = iter2.iterator();
        int i=0;
        while(cursor2.hasNext()) {
            i++;
            cursor2.next();
        }
        System.out.println(i);

    }

    /* from mongodb references */
    private static Consumer<Document> printOutput() {
        return line -> System.out.println(line.toJson(JsonWriterSettings.builder().indent(true).build()));
    }

    private void print(String line) {
        System.out.println(line);
    }
}
