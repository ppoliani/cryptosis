const nodemailer = require('nodemailer');
const identity = require('folktale/core/lambda/identity');

const {unwrapCypherResult} = require('../../../common/data/utils');
const {getAccount} = require('../../../common/data/accountRepository');

const FROM = 'Investrackr <investrackr@gmail.com>';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'investrackr@gmail.com',
    pass: "investrackr_100"
  }
});

const renderRows = investments =>  investments.map(
    investment => `<tr>
        <td><a href="178.62.44.120/investments/${investment.get('id')}">${investment.get('id')}</a></td>
        <td>${investment.get('investmentType')}</td>
        <td>${investment.get('price')}</td>
        <td>${Math.floor(investment.get('current'))}%</td>
        <td>${investment.get('lowerLimit')}%</td>
        <td>${investment.get('upperLimit')}%</td>
        <td>${investment.get('currency')}</td>
      </tr>`
  )
  .join('');

const createHtmlContent = investments => `<table>
    <thead>
      <tr>
        <td>Id</td><td>Type</td><td>Price</td><td>Current</td><td>Lower Limit</td><td>Uper Limit</td><td>Asset Life</td><td>Currency</td>
      </tr>
    </thead>
    <tbody>
     ${renderRows(investments)}
    </tbody>
  </table>`

const send = async limits =>
  limits.forEach(
    async (investments, userId) => {
      if(investments.size === 0) return;

      const userProfile = await getAccount(userId);

      await unwrapCypherResult(userProfile)
        .matchWith({
          Just: async ({value: [user]}) => {
            const mailOptions = {
              from: FROM,
              to: user.get('email'),
              subject: 'Limit Notification',
              html: createHtmlContent(investments)
            }

            try{
              await transport.sendMail(mailOptions);
            }
            catch(error) {
              logger.error(`Could not send notification to the user: ${userId}. Error: ${error}`)
            }
          },
          Nothing: identity
        });
    }
  )

module.exports = send;
