const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const saveInvestment = async investment => {
  return await runQuery(
    DbDriver,
    `
      MERGE (i:Investment {date:{date}, moneyInvested:{moneyInvested}, expenses:{expenses}, quantity:{quantity}, price: {price}, notes:{notes}})-[:HAS_TYPE]->(:InvestmentType {name:${investment.investmentType})
      WITH i
      CREATE i-[:HAS_BROKER]->(:Broker {name:${investment.broker})
      ON CREATE SET i.created = timestamp()
      ON MATCH SET i.updated = timestamp()
      RETURN i{ .*, id: ID(i) }
    `,
    investment
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

