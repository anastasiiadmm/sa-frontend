import { Button, Input, message, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { useParams } from 'react-router-dom';

import check from 'assets/images/icons/icon-check.png';
import crossed from 'assets/images/icons/icon-crossed.png';
import FieldClimateSettingsDashboard from 'containers/FieldClimate/FieldClimateSettingsDashboard/FieldClimateSettingsDashboard';
import { updateDataNames } from 'utils/helper';
import { SensorDataEntry, SensorUpdate } from 'interfaces/IStation';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  fetchStationSensors,
  stationsSelector,
  updateStationSensor,
} from 'redux/stations/stationsSlice';
import locales from 'utils/locales/fieldClimateLocales.json';
import 'containers/FieldClimate/SensorsAndNodes/_sensorsAndNodes.scss';

const { Option } = Select;

const SensorsAndNodes = () => {
  const b = bem('SensorsAndNodes');
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { sensors, sensorsLoading } = useAppSelector(stationsSelector);
  const [sensorsData, setSensorsData] = useState<SensorDataEntry[] | undefined>(undefined);
  const [updatedData, setUpdatedData] = useState<SensorUpdate[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    dispatch(fetchStationSensors({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (sensors) {
      const updatedData = updateDataNames(sensors, locales);
      setSensorsData(updatedData);
    }
  }, [sensors]);

  const handleDataChange = async (
    value: string,
    record: SensorDataEntry,
    type: 'name' | 'unit' | 'color',
  ) => {
    const updatedDataIndex = updatedData?.findIndex(
      (item: SensorUpdate) => item.code === record.code,
    );

    const updatedName = type === 'name' ? value : updatedData?.[updatedDataIndex]?.name ?? '';
    const updatedUnit = type === 'unit' ? value : updatedData?.[updatedDataIndex]?.unit ?? '';
    const updatedColor = type === 'color' ? value : updatedData?.[updatedDataIndex]?.color ?? '';

    const updatedItem = {
      channel: record.ch,
      code: record.code,
      color: updatedColor || record.color,
      name: updatedName || '',
      unit: updatedUnit || false,
    };

    await setSelectedColor(updatedColor);

    const prevUpdatedData = updatedData || [];

    if (updatedDataIndex === -1) {
      await setUpdatedData([...prevUpdatedData, updatedItem]);
    } else {
      const newUpdatedData = [...prevUpdatedData];
      newUpdatedData[updatedDataIndex] = updatedItem;
      await setUpdatedData(newUpdatedData);
    }
  };

  const handleClick = (record: SensorDataEntry, index: number) => {
    setSelectedColor(updatedData?.find((item) => item.code === record.code)?.color || '');
    setSelectedRowIndex(index);
  };

  const updateSensorsData = async () => {
    try {
      await dispatch(updateStationSensor({ id, data: updatedData })).unwrap();
      await message.success('Данные успешно обновлены!');
    } catch (e) {
      await message.error(e?.detail);
    }
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
      width: 200,
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
          return <p>Нет единиц</p>;
        }

        return (
          <Select
            defaultValue={record.unit}
            onChange={(value) => handleDataChange(value, record, 'unit')}
            style={{ width: 120 }}
          >
            {record.units.map((unit) => (
              <Option key={unit} value={unit}>
                {unit}
              </Option>
            ))}
          </Select>
        );
      },
      width: 190,
    },
    {
      title: 'Пользовательское название',
      dataIndex: 'name_custom',
      width: 200,
      render: (text: string, record) => {
        return (
          <Input
            name='name_custom'
            value={updatedData?.find((item) => item.code === record.code)?.name ?? text}
            onChange={(e) => handleDataChange(e.target.value, record, 'name')}
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
                  background:
                    index === selectedRowIndex && selectedColor
                      ? selectedColor
                      : updatedData?.find((item) => item.code === record.code)?.color ||
                        record.color,
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
                  onChange={(color: ColorResult) => handleDataChange(color?.hex, record, 'color')}
                />
              </div>
            ) : null}
          </div>
        );
      },
      width: 150,
    },
  ];

  return (
    <FieldClimateSettingsDashboard>
      <div className={b('')}>
        <Table
          pagination={false}
          data-testid='sensors-table-id'
          columns={columns}
          dataSource={sensorsData}
          rowKey={(record) => record.code as number}
          scroll={{ x: 800 }}
        />
        <Button
          loading={sensorsLoading}
          disabled={updatedData?.length === 0}
          type='primary'
          style={{ float: 'right', marginTop: 40 }}
          onClick={updateSensorsData}
        >
          Сохранить изменения
        </Button>
      </div>
    </FieldClimateSettingsDashboard>
  );
};

export default SensorsAndNodes;
