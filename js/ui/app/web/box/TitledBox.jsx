import React from 'react'
import Paper from 'material-ui/Paper'
import classnames from 'classnames'
import './box.scss'

const getHdrClassnames = color => classnames({
  center: true,
  'titled-box__header': true,
  'titled-box__header--default': color === 'default',
  'titled-box__header--primary': color === 'primary',
  'titled-box__header--secondary': color === 'secondary'
});

const TitledBox = ({header, color='default', children}) => (
  <div className="titled-box">
    <Paper zDepth={2}>
      <div className={getHdrClassnames(color)}>{header}</div>
      <div className='titled-box__body center'>{children}</div>
    </Paper>
  </div>
);

export default TitledBox
