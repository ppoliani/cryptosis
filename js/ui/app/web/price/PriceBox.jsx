import React from 'react'
import TitledBox from '../box/TitledBox'

const PriceBox = ({asset, price, source}) => (
  <div className='price-box'>
    <TitledBox header={asset}>
      <div className='price-box__row price-box__value'>{price}</div>
      <div className='price-box__row price-box__source'>{source}</div>
    </TitledBox>
  </div>
)

export default PriceBox
