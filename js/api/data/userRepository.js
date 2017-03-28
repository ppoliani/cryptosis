const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getUser = async (authResponse) =>  {
  return await runQuery(
    DbDriver,
    `
    MATCH (u:User), (fb:SocialMediaAccount {userId:{userId}, {name:{name}, email:{email}, picture:{picture}})
    MERGE (u)-[r:HAS_FB]->(fb)
    RETURN u, type(r)
    `,
    authResponse
  );

};

module.exports = {init, getUser}