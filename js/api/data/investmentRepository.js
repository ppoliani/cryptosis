const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const saveInvestment = async i => {
  return await runQuery(
    DbDriver,
    `
      MERGE (:Broker {name:"${i.broker}"})<-[:HAS_BROKER]-(i)-[:HAS_TYPE]->(:InvestmentType {name:"${i.investmentType}"})
      ON CREATE SET i.created = timestamp(), i.date=${i.date}, i.moneyInvested=${i.moneyInvested}, i.expenses=${i.expenses}, i.quantity=${i.quantity}, i.notes="${i.notes}"
      ON MATCH SET i.updated = timestamp(), i.date=${i.date}, i.moneyInvested=${i.moneyInvested}, i.expenses=${i.expenses}, i.quantity=${i.quantity}, i.notes="${i.notes}"
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

