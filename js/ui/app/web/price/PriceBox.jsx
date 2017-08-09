import React from 'react'
import TitledBox from '../box/TitledBox'
import AnimatedText from './AnimatedText'

const PriceBox = ({asset, formatedPrice, price, source}) => (
  <TitledBox header={asset}>
    <div className='price-box__row price-box__value'>
      <AnimatedText
        text={formatedPrice}
        value={price} />
    </div>
    <div className='price-box__row price-box__source'>{source}</div>
  </TitledBox>
);

export default PriceBox
