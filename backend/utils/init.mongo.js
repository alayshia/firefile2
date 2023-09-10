use admin
db.createUser(
  {
    user: process.env.MONGO_USER,
    pwd: process.env.MONGO_PASS,
    roles: [ { role: "userAdminAnyDatabase", db: process.env.MONGO_INITDB_DATABASE }, "readWriteAnyDatabase" ]
  }
)
 