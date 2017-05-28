const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('../utils');
const {calculatePortfolioValueOnSellAdded} = require('../services/portfolioService');
const {getInvestmentsOfType} = require('./investmentRepository');
const {runQuery} = require('../query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getSells = async ({ctx}) => {
  const {skip, limit} = ctx.request.query;

  return  await runQuery(
    DbDriver,
    `
      MATCH (u:User)-[:HAS_SELL]->(s:Sell)
      WHERE ID(u)=${Number(ctx.state.user.id)}
      RETURN s{ .*, id: ID(s)}
      ORDER BY s.date
      SKIP ${skip}
      LIMIT ${limit}
    `
  )
}

const getSell = async ({resource:sellId}) => {
  return await runQuery(
    DbDriver,
    `
      MATCH (s:Sell)
      WHERE ID(s) = ${sellId}
      RETURN s
    `
  )
}

const updatePortfolioState = async data => {
  console.log(data);
}

const createSell = async ({resource:sell, ctx}) => {
  const investments = await getInvestmentsOfType({type:sell.investmentType, ctx});
  await updatePortfolioState(
    calculatePortfolioValueOnSellAdded(investments, sell)
  );
}

const updateSell = async({resource:sell, ctx}) => {
  throw 'Not Implemented';
}

const deleteSell = async({resource:sellId, ctx}) => {
  throw 'Not Implemented';
}

module.exports = {
  getSells,
  getSell,
  createSell,
  updateSell,
  deleteSell
}
