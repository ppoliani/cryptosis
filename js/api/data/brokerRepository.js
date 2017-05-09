const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const saveBroker = async broker => {
  return  await runQuery(
    DbDriver,
    `
      MERGE (b:Broker {name:{name}})
      ON CREATE SET b.created = timestamp(), b.website=${broker.website}, b.email=${broker.email}, b.telephone=${telephone}, b.notes=${notes}
      ON MATCH SET b.updated = timestamp(), b.website=${broker.website}, b.email=${broker.email}, b.telephone=${telephone}, b.notes=${notes}
      RETURN b{ .*, id: ID(b) }
    `,
    broker
  );
}

module.exports = {init, saveBroker};

