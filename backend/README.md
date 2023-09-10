# Backend Service

The backend service has several endpoints to **retreive**, **add** and **delete** downloads. Downloads are sent either locally or to MongoDB database.


## Useful Commands

- Install File Locally

```sh
curl localhost:3000/download -d '{"url":"http://speedtest.ftp.otenet.gr/files/test100k.db", "storeInMongo":false, "filename": "1MB", "destination":"./"}' -H "Content-Type: application/json" -v
```

- Install File in MongoDB
  
```sh
curl localhost:3000/download -d '{"url":"http://speedtest.ftp.otenet.gr/files/test100k.db", "storeInMongo":true, "fileName": "1MB", "destination":"./"}' -H "Content-Type: application/json" -v
```

- See all downloads (both locally and in database)

```sh
curl localhost:3000/downloads | jq .
```