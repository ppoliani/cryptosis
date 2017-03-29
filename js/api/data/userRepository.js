const {runQuery} = require('./query');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getSocialMediaRelationship = source =>
  source === 'fb'
    ? 'r:HAS_FB'
    : 'r:HAS:GOOGLE';

const getUser = async (source, authResponse) => {
  return await runQuery(
    DbDriver,
    `
    MATCH (u:User), (s:SocialMediaAccount {userId:{userId}, name:{name}, email:{email}, picture:{picture}})
    WHERW (u)-${getSocialMediaRelationship(source)}->(s)
    RETURN u, type(r)
    `,
    authResponse
  );
};

const getSocialMediaAccount = async (source, authResponse) => {
  return await runQuery(
    DbDriver,
    `
      MERGE (u:USER)-[${getSocialMediaRelationship(source)}]->(s:SocialMediaAccount {userId:{userId}, name:{name}, email:{email}, picture:{picture}})
      RETURN s
    `,
    authResponse
  );
};

module.exports = {init, getSocialMediaAccount, getUser}
