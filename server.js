const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const mongoose = require('mongoose');
const app = require('./app');

//GLOBALLY HANDLING UNCAUGHT ERROR
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION 💥 Shutting Down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  //.connect(process.env.DATABASE_LOCAL,{
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection successful');
  });
const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log('Server is running on port ' + port);
});

//GLOBALLY HANDLING REJECTED PROMISE ERROR
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shutting Down...');
  console.log(err.name, err.message);

  //Shutting down server and then exit the process gracefully
  server.close(() => {
    process.exit(1); //0:success ; 1:fail
  });
});
