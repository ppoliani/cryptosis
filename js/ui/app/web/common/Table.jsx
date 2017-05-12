import React from 'react';
import DataTables from 'material-ui-datatables';

export default props => (
   <DataTables
      height={'auto'}
      selectable={false}
      showRowHover={true}
      columns={props.columns}
      data={props.data}
      showCheckboxes={false}
      onCellClick={props.handleCellClick}
      page={props.page}
      count={props.limit}
    />
)

// Aditional props
// {onCellDoubleClick={this.handleCellDoubleClick}}
// {onFilterValueChange={this.handleFilterValueChange}}
// {onSortOrderChange={this.handleSortOrderChange}}
