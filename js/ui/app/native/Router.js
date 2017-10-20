import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {NativeRouter, Route, Redirect, Link} from 'react-router-native'
import {Container, View, Text} from 'native-base'
import {getItem} from '../services/storage'
import Home from './Home'
import Layout from './layout/Layout'
import Config from 'react-native-config'
import Login from './auth/Login'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2F3A'
  }
});

class AuthGuard extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {isAuthenticated: null};
  }

  componentDidMount() {
    //TODO: process.env is not available in react-native; we need a different mechanism
    getItem(Config.ACCESS_TOKEN_KEY)
      .bimap(
        error => this.setState({isAuthenticated: false}),
        (item) => setTimeout(() => this.setState({isAuthenticated: Boolean(item)}))
      )
      .run()
  }

  render() {
    const Component = this.props.component;

    if(this.state.isAuthenticated === null) {
      // TODO: this is the place were we can add a spinner
      // or something more sophisticated
      return null;
    }

    return this.state.isAuthenticated
      ? <Component />
      : <Redirect to={{
          pathname: '/login',
          state: {
            from: this.props.location
          }
        }}/>
  }
}

const paths = {
  '/': {
    name: 'Dashboard'
  }
}

const PrivateRoute = ({component: Component, ...rest}) =>
  <Route {...rest} render={props => <AuthGuard {...props} component={Layout(paths, Component)} /> }/>


export default () => (
    <NativeRouter style={styles.container}>
      <View style={styles.container}>
        <PrivateRoute exact path="/" component={Home}/>
        <Route path="/login" component={Login}/>
      </View>
    </NativeRouter>
)
