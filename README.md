### Findbar Assessment
----
This project implements a RESTful API that allows users to import and search products in an Elasticsearch instance.

### Requirements
- Node.js version 14 or higher
- Docker

----
### Setup
- Clone the repository
```
git clone https://github.com/tasos77/findbar-assesment.git
```

- Install dependencies
```
cd findbar-assessment
npm i
```
> **Info**
> No .env file is required.

- ElasticSearch
Create docker network
```
docker network create elastic
```

- Pull ElasticSearch Docker image
```
docker pull docker.elastic.co/elasticsearch/elasticsearch:9.1.5
```

### (No Cosign required)

- Start Elasticsearch container
```
docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:9.1.5
```
> **WARNING**
> This command will start Elasticsearch in interactive mode to allow viewing the console output.

- Copy the generated `password` from the console output and place it in **/src/infra/repositories/elasticSearch/api.ts** under `password` field.

- Copy the SSL certificate from the container to your project root as `ssl.ca`

```
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .
```

### Run the application

- Start server
```
npm run start
```
> **Info**
> This will create an `uploads` folder in the root of the project.

- Bulk import data
### Generate sample product data
```
npm run generate-data
```
This creates a `product.json` file with 1000 products.
## Import data into Elasticsearch
```
npm run send-data
```
Or generate and import in one step
```
npm run generate-and-send-data
```
The implementations of these scripts are located in the **scripts** folder.
> **Info**\
> These scripts are located in the scripts folder.
> To send multiple JSON files at once, use an external HTTP client.

- Search for products
Use any HTTP client to call the `/search` endpoint.

> **Info**\
> API documentation is available at: `http://localhost:3000/api/v1/docs`

### Architecture
This application combines elements of both Clean and Onion architectures richer than Onion but simpler than full Clean Architecture.
The main idea is a clear separation between business logic and infrastructure logic.

---

- Core (`/core`)
In this folder you will find the core business logic of the application.
In more detail, this folder contains the following subfolders:
- `usecases`: Application-specific use cases depending on services.
- `services`: Business services depending on repositories.
- `repositories`: Abstractions that depend on entities.
- `entities`: Pure domain models.
> **Dependency flow: Usecases<-Services<-Repositories<-Entities**
---
- Infrastructure (`/infra`)
In this folder you will find the implementation logic of the application. That means that all the logic that is not related to specific modules or external packages is located here.
In more detail, this folder contains the following subfolders.
- `controllers`: (e.g. HTTP controller).
- `repositories`: Technical implementations of repositories..
- `services`: Technical implementations of services.
- `utils`:Utility functions and helpers.

### Assumptions and Trade offs
- Disk Storage
Local disk is used to store uploaded files to prevent data loss during processing.
> **Info** Using in-memory storage could improve performance..
- Missing parts
- Architecure\
I chose to implement all the core logic flow from the entities to usecases in order to ensure a clear separation of concerns and to make the code more maintainable. Maybe this approach is not the best because in some parts adds bloatware code that simply propagates the data or results without any processing.\
**Search based on embeddings** (Vectorization via @xenova/transformers@2.2.0 didn't function properly.)\
**Missing Analytics** Analytics are not implemented.
