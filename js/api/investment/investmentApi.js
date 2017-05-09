const {HttpError} = require('../core/api');
const logger = require('../core/logger');

const createInvestment = async (saveInvestment, unwrapCypherResult, ctx, next) => {
  const investement = ctx.request.body;

  try {
    const investementResult = await saveInvestment(investement);

    unwrapCypherResult(investementResult)
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
    ctx.body = HttpError(500, `Error saving a investement for user: ${ctx.state.user}`);
  }
};

const createInvestmentType = async (saveInvestmentType, unwrapCypherResult, ctx, next) => {
  const investementType = ctx.request.body;

  try {
    const investementTypeResult = await saveInvestmentType(investementType);

    unwrapCypherResult(investementTypeResult)
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
    ctx.body = HttpError(500, `Error saving a investementType for user: ${ctx.state.user}`);
  }
};

module.exports = {createInvestment, createInvestmentType};
