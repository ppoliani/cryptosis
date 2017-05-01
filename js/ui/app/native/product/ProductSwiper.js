import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {Image, View, StyleSheet} from 'react-native';
import {Container, DeckSwiper, Card, CardItem, Left, Thumbnail, Body, Text, Icon} from 'native-base';

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    height: 350
  }
});

export default class ProductSwiper extends Component {
  getProducts() {
    return [{
      text: 'Product 1',
      name: 'Car',
      image: 'http://www.countylabels.com/wp-content/uploads/2014/06/Products.jpg'
    }, {
      text: 'Product 2',
      name: 'Car 2',
      image: 'http://www.countylabels.com/wp-content/uploads/2014/06/Products.jpg'
    }];
  }

  renderCardHeader(item) {
    return (
      <CardItem>
        <Left>
          <Thumbnail source={{uri: item.image}} />
          <Body>
            <Text>{item.text}</Text>
            <Text note>NativeBase</Text>
          </Body>
        </Left>
      </CardItem>
    );
  }

  renderCardFooter(item) {
    return (
      <CardItem>
        <Icon name="heart" style={{ color: '#ED4A6A' }} />
        <Text>{item.name}</Text>
      </CardItem>
    );
  }

  renderCardBody(item) {
    return (
      <CardItem cardBody>
        <Image style={styles.image} source={{uri: item.image}} />
      </CardItem>
    );
  }

  @autobind
  renderItem(item) {
    return (
      <Card style={{ elevation: 3 }}>
        {this.renderCardHeader(item)}
        {this.renderCardBody(item)}
        {this.renderCardFooter(item)}
      </Card>
    );
  }

  render() {
    return (
      <Container>
        <View>
          <DeckSwiper
            dataSource={this.getProducts()}
            renderItem={this.renderItem}
          />
        </View>
      </Container>
    );
  }
}

