import React, {Component} from 'react'
import {withRouter} from 'react-router'
import {StyleSheet} from 'react-native'
import {compose} from 'folktale/core/lambda'
import {Container, Content} from 'native-base'
import Header from './Header'
import Footer from './Footer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2F3A'
  }
});

const LayoutHOC = NestedComponent => class LayoutComponent extends Component {
  render() {
    const {location} = this.props;

    return (
      <Container>
        <Header title={location.pathname}/>
        <Content>
          <NestedComponent />
        </Content>
        <Footer />
      </Container>
    );
  }
}


export default compose(withRouter, LayoutHOC)
