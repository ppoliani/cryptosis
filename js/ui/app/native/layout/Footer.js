import React, {Component} from 'react'
import {
  Footer,
  FooterTab,
  Button,
  Text,
  Icon
} from 'native-base';

export default () => (
  <Footer>
    <FooterTab>
      <Button vertical>
        <Text>Footer</Text>
        <Icon name="pie" />
      </Button>
    </FooterTab>
    <FooterTab>
      <Button vertical>
        <Text>Investments</Text>
        <Icon name="pulse" />
      </Button>
    </FooterTab>
    <FooterTab>
      <Button vertical>
        <Text>Me</Text>
        <Icon name="person" />
      </Button>
    </FooterTab>
  </Footer>
)
