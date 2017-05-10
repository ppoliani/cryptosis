const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const saveInvestment = async investment => {
  return await runQuery(
    DbDriver,
    `
      MATCH (b:Broker), (t:InvestmentType)
      WHERE b.name="${investment.broker}" AND t.name="${investment.investmentType}"
      CREATE (b)<-[:HAS_BROKER]-(i:Investment {date:{date}, moneyInvested:{moneyInvested}, expenses:{expenses}, quantity:{quantity}, notes:{notes}, created:timestamp(), updated:timestamp()})-[:HAS_TYPE]->(t)
      RETURN i{ .*, id: ID(i) }
    `,
    investment
  );
}

const updateInvestment = async investment => {
  return await runQuery(
    DbDriver,
    `
      MATCH (i:Investment), (b:Broker), (t:InvestmentType)
      WHERE ID(i) = ${investment.id} AND b.name="${investment.broker}" AND t.name="${investment.investmentType}"
      SET i = {date:{date}, moneyInvested:{moneyInvested}, expenses:{expenses}, quantity:{quantity}, notes:{notes}, updated:timestamp()}
      WITH i, b, t
      MATCH (b2:Broker)<-[hb:HAS_BROKER]-(i)-[ht:HAS_TYPE]->(t2:InvestmentType)
      DELETE hb, ht
      WITH i, b, t
      CREATE (b)<-[:HAS_BROKER]-(i)-[:HAS_TYPE]->(t)
      RETURN i{ .*, id: ID(i) }
    `,
    investment
  );
}

const deleteInvestment = async investmentId => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (i:Investment)
      WHERE ID(i) = ${investmentId}
      DETACH DELETE i
    `
  )
}


const saveInvestmentType = async investmentType => {
  return await runQuery(
    DbDriver,
    `
      CREATE (t:InvestmentType {name:{name}, type:{type}, notes:{notes}, created:timestamp(), updated:timestamp()})
      RETURN t{ .*, id: ID(t) }
    `,
    investmentType
  );
}

const updateInvestmentType= async investmentType => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (t:InvestmentType)
      WHERE ID(t) = ${investmentType.id}
      SET t = {name:{name}, type:{type}, note:{notes}, updated:timestamp()}
      RETURN t{ .*, id: ID(t) }
    `,
    investmentType
  )
}

const deleteInvestmentType= async investmentTypeId => {
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
  saveInvestment,
  updateInvestment,
  deleteInvestment,
  saveInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
};

