/* Entry point into server. */

require('dotenv').config();
const cors = require('cors');
import helmet = require('helmet');
import express = require('express');
import router from './routes';
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api', router);
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
