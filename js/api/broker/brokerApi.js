const {HttpError} = require('../core/api');
const logger = require('../core/logger');

const createBroker = async (saveBroker, unwrapCypherResult, ctx, next) => {
  const broker = ctx.request.body;

  try {
    const brokerResult = await saveBroker(broker);

    unwrapCypherResult(brokerResult)
      .matchWith({
        Just: ({value: [result]}) => {
          ctx.body = {result};
        },
        Nothing: () => {
          throw new Error();
        }
      });
  }
  catch(error) {
    ctx.status = 500;
    ctx.body = HttpError(500, `Error saving a broker for user: ${ctx.state.user}`);
  }
};

module.exports = {createBroker};
