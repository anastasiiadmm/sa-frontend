import { Table } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import moment from 'moment';
import React from 'react';

import { gridSensor, headerGrid } from 'types/stationTypes';

interface Props {
  data: gridSensor;
}

interface Column {
  title: string;
  dataIndex: string | undefined;
  key: string | undefined;
  fixed?: 'left' | 'right';
  width?: number | string;
  sorter?: (a: any, b: any) => number;
  sortDirections?: SortOrder[];
  children?: Column[];
  resizable?: boolean;
}

const GridTableComponent: React.FC<Props> = ({ data }) => {
  const convertHeadersToColumns = (headers: headerGrid[]) => {
    const columns: Column[] = [];

    headers.forEach((header) => {
      if (header.groupId) {
        const children = header?.children?.map((child) => ({
          title: child.headerName,
          dataIndex: child.field,
          key: child.field,
        }));
        columns.push({
          title: header.headerName,
          children: children ?? undefined,
          dataIndex: header.field,
          key: header.field,
        });
      } else {
        const column: Column = {
          title: header.headerName,
          dataIndex: header.field,
          key: header.field,
          width: header.headerName === 'Дата / время' ? '5%' : undefined,
        };
        if (header.headerName === 'Дата / время') {
          column.fixed = 'left';
          column.sorter = (a, b) => moment(a.datetime).diff(moment(b.datetime));
          column.sortDirections = ['descend', 'ascend'];
        }
        columns.push({
          ...column,
          key: header.field,
        });
      }
    });

    return columns;
  };

  const columns = convertHeadersToColumns(data?.headers);

  const dataSource = data?.data?.map((item: any, index) => {
    const obj: Record<string, any> = { key: index };
    Object.keys(item).forEach((key) => {
      obj[key] = item[key];
    });

    return obj;
  });

  return (
    <Table
      data-testid='chart-table-id'
      scroll={{ y: 400, x: '300vw' }}
      dataSource={dataSource}
      columns={columns}
    />
  );
};

export default GridTableComponent;
