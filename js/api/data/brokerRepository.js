const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const saveBroker = async broker => {
  return  await runQuery(
    DbDriver,
    `
      CREATE (b:Broker {name:{name}, website:{website}, email:{email}, telephone:{telephone}, notes:{notes}})
      RETURN b{ .*, id: ID(b) }
    `,
    broker
  );
}

module.exports = {init, saveBroker};

