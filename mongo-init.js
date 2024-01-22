db.createUser({
  user: process.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.MONGO_INITDB_ROOT_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: process.MONGO_INITDB_DATABASE,
    },
  ],
});
