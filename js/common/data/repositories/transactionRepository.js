const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('../utils');
const {runQuery} = require('../query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const matchClause = `
  MATCH (b:Broker)<-[:HAS_BROKER]-(txn:Transaction)-[:OWNED_BY]->(u:User), (atb:Asset)<-[:HAS_BUY_ASSET]-(txn:Transaction)-[:HAS_SELL_ASSET]->(ats:Asset)
`;

const omitProps = ['broker', 'buyAsset', 'sellAsset'];

const createTransaction = async ({resource:txn, ctx}) => {
  return await runQuery(
    DbDriver,
    `
      MATCH (b:Broker), (atb:Asset), (ats:Asset), (u:User)
      WHERE b.name="${txn.broker}" AND atb.name="${txn.buyAsset}" AND ats.name="${txn.sellAsset}" AND ID(u)=${Number(ctx.state.user.id)}
      CREATE (b)<-[:HAS_BROKER]-(txn:Transaction ${contructCreateMatchString(txn, omitProps)})-[:HAS_BUY_ASSET]->(atb)
      CREATE (txn)-[:HAS_SELL_ASSET]->(ats)
      CREATE (txn)-[:OWNED_BY]->(u)
      RETURN txn{ .*, id: ID(txn) }
    `,
    createMatchObj(txn)
  );
}

const updateTransaction = async ({resource:txn}) => {
  return await runQuery(
    DbDriver,
    `
      MATCH (txn:Transaction)-[hb:HAS_BROKER]->(:Broker), (:Asset)<-[hba:HAS_BUY_ASSET]-(txn:Transaction)-[hsa:HAS_SELL_ASSET]->(:Asset)
      WHERE ID(txn) = ${txn.id}
      DELETE hb, hba, hsa
      WITH txn
      MATCH (b:Broker), (atb:Asset), (ats:Asset)
      WHERE b.name="${txn.broker}" AND atb.name="${txn.buyAsset}" AND ats.name="${txn.sellAsset}"
      SET txn = ${contructCreateMatchString(txn, omitProps)}
      WITH txn, b, atb, ats
      CREATE (b)<-[:HAS_BROKER]-(txn)-[:HAS_BUY_ASSET]->(atb)
      CREATE (txn)-[:HAS_SELL_ASSET]->(ats)
      RETURN txn
    `,
    createMatchObj(txn)
  );
}

const getTransactions = async ({ctx}) => {
  const {skip=0, limit=1000000} = ctx.request.query;

  return  await runQuery( 
    DbDriver,
    `
      ${matchClause}
      WHERE ID(u)=${Number(ctx.state.user.id)}
      RETURN txn{ .*, id: ID(txn), buyAsset:atb.name, sellAsset:ats.name, broker:b.name}
      ORDER BY txn.date DESC
      SKIP ${skip}
      LIMIT ${limit}
    `
  )
}

const getPartialTransactions = async ({ctx}) => {
  return  await runQuery(
    DbDriver,
    `
      ${matchClause}
      WHERE ID(u)=${Number(ctx.state.user.id)}
      RETURN {id: ID(txn), buyAsset:atb.name, sellAsset:ats.name, price:txn.price, quantity:txn.quantity, expenses:txn.expenses, date:txn.date}
    `
  )
}

const getTransaction = async ({resource:txnId}) => {
  return  await runQuery(
    DbDriver,
    `
      ${matchClause}
      WHERE ID(txn) = ${txnId}
      RETURN txn{ .*, id: ID(txn), buyAsset:atb.name, sellAsset:ats.name, broker:b.name}
    `
  )
}

const deleteTransaction = async ({resource:txnId})  => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (txn:Transaction)
      WHERE ID(txn) = ${txnId}
      DETACH DELETE txn
    `
  )
}

const getTransactionsCount = async ({ctx}) => {
  return await runQuery(
    DbDriver,
    `
      MATCH (txn:Transaction)-[:OWNED_BY]->(u:User)
      WHERE ID(u)=${Number(ctx.state.user.id)}
      WITH {count: count(txn)} AS count
      RETURN count
    `
  )
}

module.exports = {
  init, 
  createTransaction,
  updateTransaction,
  getTransactions,
  getTransaction,
  getPartialTransactions,
  deleteTransaction,
  getTransactionsCount
}