import React, {Component} from 'react'
import {withRouter} from 'react-router'
import {StyleSheet} from 'react-native'
import {Container, Content} from 'native-base'
import Header from './Header'
import Footer from './Footer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2F3A'
  }
});

const LayoutHOC = (paths, NestedComponent) => class LayoutComponent extends Component {
  render() {
    const {location} = this.props;
    const title = paths[location.pathname]['name'];

    return (
      <Container>
        <Header title={title}/>
        <Content>
          <NestedComponent />
        </Content>
        <Footer />
      </Container>
    );
  }
}


export default (paths, NestedComponent) => withRouter(LayoutHOC(paths, NestedComponent))
