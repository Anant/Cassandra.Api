const app = require('./app');

const { PORT } = require('./config');

//using app from app.js, we make the app listen on whichever port we signify
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});