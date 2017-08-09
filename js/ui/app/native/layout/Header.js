import React, {Component} from 'react'
import {Header, Body, Title} from 'native-base'

export default class AppHeader extends Component {
  render() {
    return (
      <Header>
        <Body>
          <Title>Investreck</Title>
        </Body>
      </Header>
    );
  }
}
