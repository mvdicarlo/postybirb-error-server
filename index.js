const { send, json } = require('micro')
const { router, get, post } = require('microrouter');
const logger = require('winston');

const {
    transports,
    format
} = logger;

const {
    combine,
    splat,
    simple
} = format;

logger.configure({
    format: combine(
        simple()
    ),
    transports: [
        new transports.Console({
            level: 'info',
        }),
    ],
});

const pong = (req, res) => send(res, 200, 'pong');

const log = async (req, res) => {
  const body = await json(req);
  if (body && body.errorLog && body.errorLog.version)
    logger.info(JSON.stringify(body.errorLog, null, 1));
  send(res, 200, 'Log accepted');
}

module.exports = router(post('/log/error', log), get('/*', pong));
