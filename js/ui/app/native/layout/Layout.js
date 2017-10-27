import React, {Component} from 'react'
import {withRouter} from 'react-router'
import {StyleSheet} from 'react-native'
import {Container, Content} from 'native-base'
import Header from './Header'
import Footer from './Footer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
});

const LayoutHOC = (paths, NestedComponent) => class LayoutComponent extends Component {
  render() {
    const {location} = this.props;
    const title = paths[location.pathname]['name'];

    return (
      <Container>
        <Header title={title} style={{backgroundColor: '#fff'}}/>
        <Content style={styles.container}>
          <NestedComponent />
        </Content>
        <Footer />
      </Container>
    );
  }
}


export default (paths, NestedComponent) => withRouter(LayoutHOC(paths, NestedComponent))
