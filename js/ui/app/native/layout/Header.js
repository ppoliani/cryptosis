import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {
  Header,
  Body,
  Title,
  Left,
  Right,
  Icon,
  Button
} from 'native-base'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(0, 151, 167)'
  }
})

export default (props) => (
  <Header>
    <Left>
      <Button transparent>
        <Icon name='menu' />
      </Button>
    </Left>
    <Body>
      <Title>{props.title}</Title>
    </Body>
    <Right />
  </Header>
)
