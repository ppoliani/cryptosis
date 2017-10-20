import React, {Component} from 'react'
import {Header, Body, Title} from 'native-base'

export default class AppHeader extends Component {
  render() {
    return (
      <Header>
        <Body>
          <Title>Cryptosis</Title>
        </Body>
      </Header>
    );
  }
}
