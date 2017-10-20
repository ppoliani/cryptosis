import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {NativeRouter, Route, Redirect, Link} from 'react-router-native'
import {Container, View} from 'native-base'
import {getItem} from '../services/storage'
import Home from './Home'
import Layout from './layout/Layout'
// import Login from './auth/Login'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2F3A'
  }
});

class AuthGuard extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {isAuthenticated: true};
  }

  componentDidMount() {
    //TODO: process.env is not available in react-native; we need a different mechanism
    // getItem(process.env.ACCESS_TOKEN_KEY)
    //   .bimap(
    //     error => this.setState({isAuthenticated: false}),
    //     () => setTimeout(() => this.setState({isAuthenticated: true}))
    //   )
    //   .run()
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

const PrivateRoute = ({component: Component, ...rest}) =>
  <Route {...rest} render={props => <AuthGuard {...props} component={Component} /> }/>


const RouteList = () =>  (
  <View style={styles.container}>
    <PrivateRoute exact path="/" component={Home}/>
    {/* <Route path="/login" component={Login}/> */}
  </View>
)

const paths = {
  '/': {
    name: 'Dashboard'
  }
}


export default () => {
  const LayoutHOC = Layout(paths, RouteList);

  return (
    <NativeRouter style={styles.container}>
      <LayoutHOC />
    </NativeRouter>
  )
}
