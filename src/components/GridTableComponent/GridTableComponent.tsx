import { Table } from 'antd';
import { CompareFn, SortOrder } from 'antd/es/table/interface';
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
  sorter?: CompareFn<object>;
  sortDirections?: SortOrder[];
  children?: Column[];
  resizable?: boolean;
}

interface DataItem {
  datetime: string | number;
  [key: string]: number | string;
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
          column.sorter = (a: object, b: object) => {
            const datetimeA = moment((a as DataItem)?.datetime);
            const datetimeB = moment((b as DataItem)?.datetime);
            return datetimeA.diff(datetimeB);
          };
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

  const dataSource = data?.data?.map((item: string | number, index) => {
    const obj: Record<string, number> = { key: index };
    if (typeof item === 'object') {
      Object.keys(item).forEach((key) => {
        obj[key] = item[key] as number;
      });
    }

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
