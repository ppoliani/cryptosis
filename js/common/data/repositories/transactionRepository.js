const {contructCreateMatchString, contructUpdateMatchString, createMatchObj} = require('../utils');
const {runQuery} = require('../query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const omitProps = ['broker', 'buyAsset', 'sellAsset'];

const createTransaction = async ({resource:txn, ctx}) => {
  return await runQuery(
    DbDriver,
    `
      MATCH (b:Broker), (atb:AssetType), (ats:AssetType), (u:User)
      WHERE b.name="${txn.broker}" AND atb.name="${txn.buyAsset}" AND ats.name="${txn.sellAsset}" AND ID(u)=${Number(24/*ctx.state.user.id*/)}
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
      MATCH (txn:Transaction)-[hb:HAS_BROKER]->(:Broker), (:AssetType)<-[hba:HAS_BUY_ASSET]-(txn:Transaction)-[hsa:HAS_SELL_ASSET]->(:AssetType)
      WHERE ID(txn) = ${txn.id}
      DELETE hb, hba, hsa
      WITH txn
      MATCH (b:Broker), (atb:AssetType), (ats:AssetType)
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
      MATCH (txn:Transaction)-[:OWNED_BY]->(u:User)
      WHERE ID(u)=${Number(24/*ctx.state.user.id*/)}
      RETURN txn{ .*, id: ID(txn)}
      ORDER BY txn.date DESC
      SKIP ${skip}
      LIMIT ${limit}
    `
  )
}

module.exports = {
  init, 
  createTransaction,
  updateTransaction,
  getTransactions
}

// const getAllPartialAssets = async () => {
//   return  await runQuery(
//     DbDriver,
//     `
//       MATCH (u:User)-${ASSET_EDGE}->${ASSET_NODE}
//       RETURN {id: ID(u), assets: collect(i)}
//     `
//   )
// }

// const getPartialTransactions = async ({ctx}) => {
//   return  await runQuery(
//     DbDriver,
//     `
//       MATCH (u:User)-${ASSET_EDGE}->${ASSET_NODE}
//       WHERE ID(u)=${Number(ctx.state.user.id)}
//       RETURN {id: ID(i), buyAsset:i.buyAsset, sellAsset:i.sellAsset, price:i.price, quantity:i.quantity, expenses:i.expenses, date:i.date}
//     `
//   )
// }

// const getInvestment = async ({resource:assetId}) => {
//   return  await runQuery(
//     DbDriver,
//     `
//       MATCH ${ASSET_NODE}
//       WHERE ID(i) = ${assetId}
//       RETURN i
//     `
//   )
// }

// const getAssetCount = async ({ctx}) => {
//   return await runQuery(
//     DbDriver,
//     `
//       MATCH (u:User)-${ASSET_EDGE}->${ASSET_NODE}
//       WHERE ID(u)=${Number(ctx.state.user.id)}
//       WITH {count: count(i)} AS count
//       RETURN count
//     `
//   )
// }

// const getAssets = async ({ctx}) => {
//   const {skip=0, limit=1000000} = ctx.request.query;

//   return  await runQuery( 
//     DbDriver,
//     `
//       MATCH (u:User)-${ASSET_EDGE}->${ASSET_NODE}
//       WHERE ID(u)=${Number(ctx.state.user.id)}
//       RETURN i{ .*, id: ID(i)}
//       ORDER BY i.date DESC
//       SKIP ${skip}
//       LIMIT ${limit}
//     `
//   )
// }


// const deleteAsset = async ({resource:investmentId})  => {
//   return  await runQuery(
//     DbDriver,
//     `
//       MATCH ${ASSET_NODE}
//       WHERE ID(i) = ${investmentId}
//       DETACH DELETE i
//     `
//   )
// }
