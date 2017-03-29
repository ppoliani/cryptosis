const {runQuery} = require('./query');
const {generateToken} = require('../auth/jwt');

let DbDriver;

const init = driver => {
  DbDriver = driver;
}

const getSocialMediaRelationship = source =>
  source === 'fb'
    ? 'r:HAS_FB'
    : 'r:HAS:GOOGLE';


const getOrSaveSocialMediaAccount = async (source, authResponse) => {
  return await runQuery(
    DbDriver,
    `
      MERGE (u:User)-[${getSocialMediaRelationship(source)}]->(s:SocialMediaAccount {userId:{userId}, name:{name}, email:{email}, picture:{picture}})
      RETURN s
    `,
    authResponse
  );
};

const createToken = async (source, account) => {
  const token = generateToken(account);
  return await runQuery(
    DbDriver,
    `
    MATCH (u:User)-[${getSocialMediaRelationship(source)}]->(s:SocialMediaAccount {userId:"${account.userId}"})
    MERGE (u)-[rt:HAS_TOKEN]->(t:AccessToken)
    ON CREATE SET t.created = timestamp(), t.value="${token}"
    ON MATCH SET t.updated = timestamp(), t.value="${token}"
    RETURN t.value
    `
  );
};

module.exports = {init, getOrSaveSocialMediaAccount, createToken}
