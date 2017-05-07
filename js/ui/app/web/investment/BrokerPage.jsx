import React, {Component} from 'react';
import AddBroker from './form/AddBroker';

const onSubmit = async (values) => {
  await Promise.resolve();
  console.log(values);
}

export default class BrokerPage extends Component {
  render() {
    return (
      <div>
        <AddBroker onSubmit={onSubmit}/>
      </div>
    );
  }
}
