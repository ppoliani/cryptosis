import React, {Component} from 'react';
import AddInvestment from './forms/AddInvestment';

const onSubmit = async (values) => {
  await Promise.resolve();
  console.log(values);
}

export default class Investment extends Component {
  render() {
    return (
      <AddInvestment onSubmit={onSubmit}/>
    );
  }
}
