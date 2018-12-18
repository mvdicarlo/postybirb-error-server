const express = require('express');
const bodyParser = require('body-parser');
const logger = require('winston');
const rateLimit = require('express-rate-limit');

const {
    transports,
    format
} = require('winston');

const {
    combine,
    timestamp,
    prettyPrint,
} = format;

logger.configure({
    level: 'error',
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    transports: [
        new transports.Console({
            level: 'error',
        }),
        new transports.Console({
            level: 'info',
        }),
    ],
});

const app = express();
app.enable('trust proxy');
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: 'Too many requests from this IP'
});

app.use(limiter);
app.use(bodyParser.json({limit: '150kb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '0kb',
}));


app.get('/', (req, res) => {
    res.send('pong!');
});

app.post('/log/error', (req, res) => {
  if (req.body.errorLog) {
    try {
      logger.log('error', '/log/error', req.body.errorLog);
      res.status(200).send('Log accepted');
    } catch (err) {
      logger.log('error', '/log/error exception', err);
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
    logger.info('Server listening on port 3000');
});
