const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('../utils');
const {runQuery} = require('../query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getAllPartialInvestments = async () => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (u:User)-[:HAS_INVESTMENT]->(i:Investment)
      RETURN {id: ID(u), investments: collect(i)}
    `
  )
}

const getPartialInvestments = async ({ctx}) => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (u:User)-[:HAS_INVESTMENT]->(i:Investment)
      WHERE ID(u)=${Number(ctx.state.user.id)}
      RETURN {id: ID(i), investmentType:i.investmentType, positionType:i.positionType, currency:i.currency, price:i.price, quantity:i.quantity, expenses:i.expenses, date:i.date}
    `
  )
}

const getInvestment = async ({resource:investmentId}) => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (i:Investment)
      WHERE ID(i) = ${investmentId}
      RETURN i
    `
  )
}

const getInvestments = async ({ctx}) => {
  const {skip, limit} = ctx.request.query;

  return  await runQuery(
    DbDriver,
    `
      MATCH (u:User)-[:HAS_INVESTMENT]->(i:Investment)
      WHERE ID(u)=${Number(ctx.state.user.id)}
      RETURN i{ .*, id: ID(i)}
      ORDER BY i.date
      SKIP ${skip}
      LIMIT ${limit}
    `
  )
}

const saveInvestment = async ({resource:investment, ctx}) => {
  return await runQuery(
    DbDriver,
    `
      MATCH (b:Broker), (t:InvestmentType), (u:User)
      WHERE b.name="${investment.broker}" AND t.name="${investment.investmentType}" AND ID(u)=${Number(ctx.state.user.id)}
      CREATE (b)<-[:HAS_BROKER]-(i:Investment ${contructCreateMatchString(investment)})-[:HAS_TYPE]->(t)
      CREATE (u)-[:HAS_INVESTMENT]->(i)
      RETURN i{ .*, id: ID(i) }
    `,
    createMatchObj(investment)
  );
}

const updateInvestment = async ({resource:investment}) => {
  return await runQuery(
    DbDriver,
    `
      MATCH (i:Investment), (b:Broker), (t:InvestmentType)
      WHERE ID(i) = ${investment.id} AND b.name="${investment.broker}" AND t.name="${investment.investmentType}"
      SET i = ${contructCreateMatchString(investment)}
      WITH i, b, t
      MATCH (b2:Broker)<-[hb:HAS_BROKER]-(i)-[ht:HAS_TYPE]->(t2:InvestmentType)
      DELETE hb, ht
      WITH i, b, t
      CREATE (b)<-[:HAS_BROKER]-(i)-[:HAS_TYPE]->(t)
      RETURN i
    `,
    createMatchObj(investment)
  );
}

const deleteInvestment = async ({resource:investmentId})  => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (i:Investment)
      WHERE ID(i) = ${investmentId}
      DETACH DELETE i
    `
  )
}

const getInvestmentTypes = async ({ctx}) => {
  const {skip, limit} = ctx.request.query;

  return  await runQuery(
    DbDriver,
    `
      MATCH (t:InvestmentType)
      RETURN t{ .*, id: ID(t)}
      ORDER BY t.name
      SKIP ${skip}
      LIMIT ${limit}
    `
  )
}

const saveInvestmentType = async ({resource:investmentType})  => {
  return await runQuery(
    DbDriver,
    `
      CREATE (t:InvestmentType ${contructCreateMatchString(investmentType)})
      RETURN t{ .*, id: ID(t) }
    `,
    createMatchObj(investmentType)
  );
}

const updateInvestmentType= async ({resource:investmentType})  => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (t:InvestmentType)
      WHERE ID(t) = ${investmentType.id}
      SET t = ${contructCreateMatchString(investmentType)}
      RETURN t
    `,
    createMatchObj(investmentType)
  )
}

const deleteInvestmentType= async ({resource:investmentTypeId})  => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (t:InvestmentType)
      WHERE ID(t) = ${investmentTypeId}
      DETACH DELETE t
    `
  )
}

module.exports = {
  init,
  getAllPartialInvestments,
  getPartialInvestments,
  getInvestment,
  getInvestments,
  saveInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentTypes,
  saveInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
}

