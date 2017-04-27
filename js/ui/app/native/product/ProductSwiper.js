import React, {Component} from 'react';
import {Container, DeckSwiper, View, Card, CardItem, Left, Thumbnail, Body, Text} from 'native-base';

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
          <Thumbnail source={item.image} />
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
        <Image style={{ resizeMode: 'cover', width: null }} source={item.image} />
      </CardItem>
    );
  }

  renderItem(item) {
    <Card style={{ elevation: 3 }}>
      {this.renderCardHeader(item)}
      {this.renderCardBody(item)}
      {this.renderCardFooter(item)}
    </Card>
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
