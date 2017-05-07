import React, {Component} from 'react';
import AddInvestment from './form/AddInvestment';
import AddBroker from './form/AddBroker';

const onSubmit = async (values) => {
  await Promise.resolve();
  console.log(values);
}

export default class Investment extends Component {
  render() {
    return (
      <div>
        <AddBroker onSubmit={onSubmit}/>
        <AddInvestment onSubmit={onSubmit}/>
      </div>
    );
  }
}
