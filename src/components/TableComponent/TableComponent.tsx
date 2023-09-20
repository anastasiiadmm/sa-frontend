import { Empty, Table, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { Key } from 'antd/lib/table/interface';
import React from 'react';

import notFoundImages from 'assets/images/notFound.svg';
import PaginationComponent from 'components/TableComponent/PaginationComponent/PaginationComponent';
import { pagination, Requestor } from 'interfaces';

interface Props {
  data: any | undefined;
  columns: any | null;
  rowKey: (record: any) => Key;
  loading: boolean;
  paginationActive?: boolean;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>,
  ) => void;
  params?: pagination | null;
  pagePrevHandler?: () => void;
  pageNextHandler?: () => void;
  rowClickHandler?: (record: Requestor) => void;
  disabledButton?: boolean;
  scroll?:
    | { x?: string | number; y?: string | number } & {
        scrollToFirstRowOnChange?: boolean;
      };
}

const TableComponent: React.FC<Props> = ({
  scroll = { x: 950 },
  loading,
  columns,
  data,
  onChange,
  rowKey,
  params,
  pagePrevHandler,
  pageNextHandler,
  rowClickHandler,
  paginationActive,
}) => {
  const rowClassName = (record: Requestor, index: number) => {
    if (index % 2 === 0) {
      return '';
    }
    return 'blue-row';
  };

  const locale = {
    emptyText: (
      <Empty
        image={<img src={notFoundImages} alt='notFoundImages' />}
        imageStyle={{
          height: 300,
        }}
        description={<h2>Данные отсутствуют</h2>}
      />
    ),
  };

  return (
    <>
      <Table
        scroll={scroll}
        onRow={(record) => ({
          onClick: () => rowClickHandler && rowClickHandler(record),
        })}
        loading={loading}
        rowKey={rowKey}
        locale={locale}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={false}
        rowClassName={rowClassName}
      />
      {!paginationActive && (
        <PaginationComponent
          params={params}
          pagePrevHandler={pagePrevHandler}
          pageNextHandler={pageNextHandler}
        />
      )}
    </>
  );
};

export default TableComponent;
