const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const saveBroker = async broker => {
  return  await runQuery(
    DbDriver,
    `
      OPTIONAL MATCH (:Broker {name:{name}})
      MERGE (b:Broker {name:{name}, website:{website}, email:{email}, telephone:{telephone}, notes:{notes}})
      RETURN b{ .*, id: ID(b) }
    `,
    broker
  );
}

const updateBroker = async broker => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (b:Broker {id:{id}})
      RETURN b
    `,
    broker
  );
}

module.exports = {init, saveBroker, updateBroker};

