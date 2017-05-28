const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('./utils');
const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getSells = ({ctx}) => {
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
  return  await runQuery(
    DbDriver,
    `
      MATCH (s:Sell)
      WHERE ID(s) = ${sellId}
      RETURN s
    `
  )
}

module.exports = {
  getSells,
  getSell,
  createSell,
  updateSell,
  deleteSell
}
