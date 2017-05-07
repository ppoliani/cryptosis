import React, {Component} from 'react';

const onSubmit = async (values) => {
  await Promise.resolve();
  console.log(values);
}

export default class BrokerPage extends Component {
  render() {
    return (
      <div>
        Investment Type Page
      </div>
    );
  }
}
