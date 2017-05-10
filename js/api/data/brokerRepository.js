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
  )
}

const updateBroker = async broker => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (b:Broker)
      WHERE ID(b) = ${broker.id}
      SET b = {name:{name}, website:{website}, email:{email}, telephone:{telephone}, notes:{notes}}
      RETURN b{ .*, id: ID(b) }
    `,
    broker
  )
}

const deleteBroker = async brokerId => {
  return  await runQuery(
    DbDriver,
    `
      MATCH (b:Broker)
      WHERE ID(b) = ${brokerId}
      DETACH DELETE b
    `
  )
}

module.exports = {init, saveBroker, updateBroker, deleteBroker};

