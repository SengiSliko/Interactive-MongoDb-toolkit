# Interactive-MongoDb-toolkit

## Overview

This repository contains an interactive toolkit for managing and analyzing data using MongoDB. The project combines JavaScript functions and Java applications to demonstrate powerful MongoDB features, including CRUD operations, aggregation, and Java-based data processing.

## Features

### 1. Data Management with MongoDB Shell
- **Insert Data**: Dynamically add Cartesian coordinate points to collections.
- **Query Nearest Point**: Find the nearest point to given coordinates using Euclidean distance.
- **Update Values**: Modify document values based on specified conditions.
- **Delete Records**: Remove documents that meet specific criteria.

### 2. Data Analysis and Aggregation
- **State Population Analytics**: Calculate and display population data for U.S. states.
- **Custom Geographic Queries**: Retrieve places within specified latitude and longitude bounds.
- **Map-Reduce Operations**: Use map-reduce to aggregate state population data.

### 3. Java Integration with MongoDB
- **Database Connectivity**: Connect to a MongoDB instance and list all collections.
- **Facebook Data Processing**:
  - Retrieve and display documents from the `facebook` collection.
  - Count and analyze messages in the dataset.
- **Message Collection Creation**: Extract and structure specific message data into a new collection.
- **Keyword Search**: Count documents containing specific keywords like "spring" or "September."

## Prerequisites

- MongoDB version 4.0.12 or newer.
- MongoDB Java Driver (`mongo-java-driver`).
- Java Development Kit (JDK) version 8 or newer.

## Setup Instructions

1. **Install MongoDB**:
   - Follow the official MongoDB installation guide.
   - Start the MongoDB server using `mongod`.

2. **Import Sample Data**:
   - Use `mongoimport` to load the provided `zipcodes.json` and `Facebookdata.json` files into MongoDB.

3. **Run MongoDB Shell Scripts**:
   - Load and execute the `mongorc.js` file in the MongoDB shell.

4. **Run Java Application**:
   - Add `mongo-java-driver.jar` to your project's classpath.
   - Compile and execute the Java source files.

## Project Structure

```plaintext
.
├── mongorc.js             # JavaScript functions for MongoDB shell
├── Facebookdata.json      # Sample Facebook data
├── zipcodes.json          # Sample zip code data
├── src/                   # Java source files
│   ├── Main.java          # Main application entry point
│   └── Utils.java         # Utility functions for database operations
└── README.md              # Project documentation
