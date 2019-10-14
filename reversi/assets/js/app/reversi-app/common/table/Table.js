import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';

const tableIcons = {
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />)
};

export default function Table(props) {
  const selectedRowData =
    Object.keys(props.selectedRowData).length === 0
      ? props.columns.reduce(
          (acc, col) => Object.assign(acc, { [col]: '' }),
          {}
        )
      : props.selectedRowData;
  return props.data.length === 0 ? (
    <div />
  ) : (
    <MaterialTable
      icons={tableIcons}
      title={props.title}
      columns={props.columns}
      data={props.data}
      onRowClick={(_, rowData) => {
        if (
          Object.keys(selectedRowData).every(
            field => selectedRowData[field] === rowData[field]
          )
        ) {
          props.setSelectedRowData({});
        } else {
          props.setSelectedRowData(rowData);
        }
      }}
      options={{
        rowStyle: rowData => ({
          backgroundColor: Object.keys(selectedRowData).every(
            field => selectedRowData[field] === rowData[field]
          )
            ? '#d3d3d3' // lightgray
            : '#ffffff' // white
        })
      }}
    />
  );
}

Table.defaultProps = {
  title: ''
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSelectedRowData: PropTypes.func.isRequired,
  // keys of `selectedRowData` depends on data structure
  // eslint-disable-next-line react/forbid-prop-types
  selectedRowData: PropTypes.object.isRequired,
  title: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired
};
