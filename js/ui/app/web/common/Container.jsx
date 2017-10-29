import React from 'react'
import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card'

export default ({title, subtitle='', children}) => (
  <Card>
    <CardHeader
      title={title}
      subtitle={() => subtitle} />
      <CardMedia>
        {children}
      </CardMedia>
  </Card>
)
