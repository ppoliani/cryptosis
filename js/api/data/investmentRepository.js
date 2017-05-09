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
      CREATE (b)<-[:HAS_BROKER]-(i:Investment {date:{date}, moneyInvested:{moneyInvested}, expenses:{expenses}, quantity:{quantity}, notes:{notes}})-[:HAS_TYPE]->(t)
      RETURN i{ .*, id: ID(i) }
    `,
    i
  );
}

const saveInvestmentType = async investmentType => {
  return await runQuery(
    DbDriver,
    `
      MERGE (t:InvestmentType {name:{name}})
      ON CREATE SET t.created=timestamp(), t.type="${investmentType.type}", t.notes="${investmentType.notes}"
      ON MATCH SET t.updated=timestamp(), t.type="${investmentType.type}", t.notes="${investmentType.notes}"
      RETURN t{ .*, id: ID(t) }
    `,
    investmentType
  );
}

module.exports = {init, saveInvestment, saveInvestmentType};

