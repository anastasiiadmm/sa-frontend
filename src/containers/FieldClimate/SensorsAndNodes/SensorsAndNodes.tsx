import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { useParams } from 'react-router-dom';

import check from 'assets/images/icons/icon-check.png';
import crossed from 'assets/images/icons/icon-crossed.png';
import FormField from 'components/FormField/FormField';
import FieldClimateSettingsDashboard from 'containers/FieldClimate/FieldClimateSettingsDashboard/FieldClimateSettingsDashboard';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchStationSensors, stationsSelector } from 'redux/stations/stationsSlice';
import { SensorDataEntry } from 'types/stationTypes';

import 'containers/FieldClimate/SensorsAndNodes/_sensorsAndNodes.scss';

const SensorsAndNodes = () => {
  const b = bem('SensorsAndNodes');
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { sensors, sensorsLoading } = useAppSelector(stationsSelector);
  const [sensorsData, setSensorsData] = useState<SensorDataEntry[] | undefined>(undefined);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    dispatch(fetchStationSensors({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (sensors) {
      setSensorsData(sensors);
    }
  }, [sensors]);

  const handleUnitChange = (record: any, value: any) => {};

  const handleColorChange = (newColor: ColorResult, record: SensorDataEntry) => {
    const updatedData = sensorsData?.map((item) => {
      if (item.code === record.code) {
        return {
          ...item,
          color: newColor.hex,
        };
      }
      return item;
    });

    setSensorsData(updatedData);
    setSelectedColor(newColor.hex);
  };

  const handleClick = (record: SensorDataEntry, index: number) => {
    setSelectedColor(record.color);
    setSelectedRowIndex(index);
  };

  const columns: ColumnsType<SensorDataEntry> = [
    {
      title: 'Канал',
      dataIndex: 'ch',
      width: 80,
    },
    {
      title: 'Код',
      dataIndex: 'code',
      width: 80,
    },
    {
      title: 'Название',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: 'Активный',
      dataIndex: 'isActive',
      render: (text: string, record) => {
        return record?.isActive ? (
          <img style={{ width: 15 }} src={check} alt='check' />
        ) : (
          <img style={{ width: 15 }} src={crossed} alt='crossed' />
        );
      },
      width: 100,
    },
    {
      title: 'Ед. изм',
      dataIndex: 'units',
      render: (text: string, record) => {
        if (!record.units || record.units.length === 0) {
          return null;
        }

        const options = record.units.map((unit) => ({ label: unit, value: unit }));

        return (
          <FormField
            type='select'
            defaultValue={text}
            onChange={handleUnitChange}
            options={options.map((option) => ({
              ...option,
              selected: option.value === text,
            }))}
          />
        );
      },
      width: 120,
    },
    {
      title: 'Пользовательское название',
      dataIndex: 'name_custom',
      width: 150,
      render: (text: string) => {
        return (
          <FormField
            className={b('custom-style')}
            bordered
            defaultValue={text}
            onChange={handleUnitChange}
          />
        );
      },
    },
    {
      title: 'Цвет',
      dataIndex: 'color',
      render: (text: string, record, index) => {
        const displayColorPicker = index === selectedRowIndex;

        return (
          <div>
            <button
              type='button'
              className={b('swatch')}
              onClick={() => handleClick(record, index)}
            >
              <div
                style={{
                  width: 60,
                  height: 20,
                  borderRadius: 2,
                  background: record.color === selectedColor ? selectedColor : record.color,
                }}
              />
            </button>
            {displayColorPicker ? (
              <div className={b('popover')}>
                <div
                  className={b('cover')}
                  onClick={() => setSelectedRowIndex(null)}
                  role='button'
                  aria-label='Close color picker'
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleClick(record, index);
                    }
                  }}
                  tabIndex={0}
                />
                <SketchPicker
                  color={selectedColor}
                  onChange={(color: ColorResult) => handleColorChange(color, record)}
                />
              </div>
            ) : null}
          </div>
        );
      },
      width: 120,
    },
  ];

  const paginationLocale = {
    items_per_page: '/ стр',
    page: '',
  };

  return (
    <FieldClimateSettingsDashboard>
      <div className={b('')}>
        <Table
          columns={columns}
          dataSource={sensorsData}
          rowKey={(record) => record.code as number}
          scroll={{ x: 800 }}
          pagination={{
            locale: paginationLocale,
          }}
        />
        <Button type='primary' style={{ float: 'right' }}>
          Сохранить изменения
        </Button>
      </div>
    </FieldClimateSettingsDashboard>
  );
};

export default SensorsAndNodes;
