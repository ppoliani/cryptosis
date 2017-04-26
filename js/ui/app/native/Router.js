import React, {Component} from 'react';
import {View} from 'react-native';
import {NativeRouter, Route, Redirect, Link} from 'react-router-native';
import {getItem} from '../storage';
import Home from './Home';
import Login from './auth/Login';

class AuthGuard extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {isAuthenticated: null};
  }

  componentDidMount() {
    getItem(process.env.ACCESS_TOKEN_KEY)
      .bimap(
        error => this.setState({isAuthenticated: false}),
        () => this.setState({isAuthenticated: true})
      )
      .run()
  }

  render() {
    const Component = this.props.component;

    if(this.state.isAuthenticated === null) return null;

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

const PrivateRoute = ({component: Component, ...rest}) =>
  <Route {...rest} render={props => <AuthGuard {...props} component={Component} /> }/>

export default () =>
  <NativeRouter>
    <View>
      <PrivateRoute exact path="/" component={Home}/>
      <Route path="/login" component={Login}/>
    </View>
  </NativeRouter>;
