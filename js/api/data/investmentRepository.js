const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const saveInvestment = async i => {
  return await runQuery(
    DbDriver,
    `
      MATCH (b:Broker), (t:InvestmentType)
      WHERE b.name="${i.broker}" AND t.name="${i.investmentType}"
      CREATE (b)<-[:HAS_BROKER]-(i:Investment {date:{date}, moneyInvested:{moneyInvested}, expenses:{expenses}, quantity:{quantity}, notes:{notes}, created:timestamp(), updated:timestamp()})-[:HAS_TYPE]->(t)
      RETURN i{ .*, id: ID(i) }
    `,
    i
  );
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
  saveInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
};

