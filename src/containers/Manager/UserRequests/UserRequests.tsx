import { EyeOutlined } from '@ant-design/icons';
import { Button, message, TablePaginationConfig, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import bem from 'easy-bem';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import newUser from 'assets/images/icons/new_user_request.svg';
import sun from 'assets/images/icons/sun.svg';
import tractorRequest from 'assets/images/icons/tractor_request.svg';
import user from 'assets/images/icons/user_request.svg';
import Errors from 'components/Errors/Errors';
import RequestModal from 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/RequestModal';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import FieldClimateModal from 'components/ModalComponent/ModalChildrenComponents/FieldClimateModal/FieldClimateModal';
import RequestModals from 'components/ModalComponent/ModalChildrenComponents/RequestModals/RequestModals';
import RequestAddTechnique from 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestAddTechnique/RequestAddTechnique';
import RequestRegisterUser from 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestRegisterUser/RequestRegisterUser';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import TableComponent from 'components/TableComponent/TableComponent';
import { IMyData, IMyDataApi, Requestor } from 'interfaces';
import {
  accountsSelector,
  approveRequest,
  deleteRequest,
  fetchRequests,
  requestApproveChangeProfile,
} from 'redux/accounts/accountsSlice';
import {
  clearUserInfo,
  companiesSelector,
  fetchUserInfo,
  techniqueVehicleInfo,
  techniqueVehicleInfoSelector,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { dateMomentTypeDash } from 'utils/constants';
import {
  appendDataFieldsAndDeleteEmptyKeys,
  getPageNumber,
  getPageNumberPrevious,
} from 'utils/helper';
import { fileSizeValidate, fileValidateImg } from 'utils/validate/validate';
import 'containers/Manager/UserRequests/_userRequests.scss';

const { Title } = Typography;

const UserRequests = () => {
  const b = bem('UserRequests');
  const dispatch = useAppDispatch();
  const {
    requests,
    fetchRequestsLoading,
    requestsPagination,
    vehicleDeleteLoading,
    fetchRequestsError,
    approveRequestLoading,
    requestApproveChangeProfileLoading,
  } = useAppSelector(accountsSelector);
  const { userInfo, userInfoLoading, userInfoError } = useAppSelector(companiesSelector);
  const { results, loading, errors } = useAppSelector(techniqueVehicleInfoSelector);
  const [isModalTechniqueOpen, setIsModalTechniqueOpen] = useState(false);
  const [isModalRegisterUserOpen, setIsModalRegisterUserTechniqueOpen] = useState(false);
  const [isModalRejectOpen, setIsModalRejectOpen] = useState(false);
  const [isModalRequestOpen, setIsModalRequestOpen] = useState(false);
  const [isModalFieldClimateRequestOpen, setIsModalFieldClimateRequestOpen] = useState(false);
  const [isModalUserInfoOpen, setIsModalUserInfoRejectOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: requestsPagination?.next
      ? Number(getPageNumber(requestsPagination?.next))
      : Number(getPageNumberPrevious(requestsPagination?.previous)),
  });
  const [fieldClimateData, setFieldClimateData] = useState<Requestor | null>(null);
  const [confirmationTypeId, setConfirmationTypeId] = useState<number | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [data, setData] = useState<IMyDataApi>({
    data: {
      user: {
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        phone: '',
        username: '',
      },
      enterprise: {
        name: '',
        location: '',
        autopilots_amount: '',
      },
    },
  });
  const [images, setImages] = useState<{ image: File | null; deleted_image: string | null }>({
    image: null,
    deleted_image: null,
  });
  const [orderSort, setOrderSort] = useState({ ordering: '' });

  useEffect(() => {
    const data = {
      query: {
        page: filters?.page,
        ordering: orderSort?.ordering,
      },
    };
    dispatch(fetchRequests({ data }));
  }, [dispatch, filters, orderSort]);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserInfo({ id }));
    }
  }, [dispatch, id]);

  const handleTableSortChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<string> | SorterResult<string>[],
  ) => {
    const columnKey = Array.isArray(sorter)
      ? sorter[0]?.column?.dataIndex
      : sorter?.column?.dataIndex;
    const order = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;
    const sortableColumnKeys = ['created_at', 'category'];

    const orderingMap: Record<string, string> = {
      created_at: '-created_at',
      category: '-category',
    };

    if (columnKey && sortableColumnKeys.includes(columnKey as string)) {
      const ordering =
        order === 'descend' ? orderingMap[columnKey as string] : (columnKey as string);

      setOrderSort({ ordering });
    }
  };

  const showRejectModal = () => {
    setIsModalRejectOpen(true);
  };

  const handleOkRejectCancel = () => {
    setIsModalRejectOpen(!isModalRejectOpen);
  };

  const rejectHandler = async () => {
    try {
      if (id) {
        await dispatch(deleteRequest({ id: String(id) })).unwrap();
        setIsModalTechniqueOpen(false);
        setIsModalRejectOpen(false);
        setIsModalRegisterUserTechniqueOpen(false);
        setIsModalUserInfoRejectOpen(false);
        setIsModalFieldClimateRequestOpen(false);
      }
    } catch (e) {
      setIsModalTechniqueOpen(false);
      setIsModalRejectOpen(false);
      setIsModalRegisterUserTechniqueOpen(false);
      setIsModalUserInfoRejectOpen(false);
      setIsModalFieldClimateRequestOpen(false);
      message.error('Не удалось удалить');
    }
  };

  const showTechniqueModal = (row: Requestor) => {
    dispatch(clearUserInfo());
    dispatch(techniqueVehicleInfo(row.id));
    setIsModalTechniqueOpen(true);
  };

  const handleOkTechniqueCancel = () => {
    setIsModalTechniqueOpen(!isModalTechniqueOpen);
  };

  const showRegisterUserModal = () => {
    setIsModalRegisterUserTechniqueOpen(true);
  };

  const handleOkRegisterUserCancel = () => {
    setIsModalRegisterUserTechniqueOpen(!isModalRegisterUserOpen);
  };

  const showUserInfoModal = () => {
    setIsModalUserInfoRejectOpen(true);
  };

  const handleOkUserInfoCancel = () => {
    setIsModalUserInfoRejectOpen(!isModalUserInfoOpen);
  };

  const showFieldClimateInfoModal = (row: Requestor) => {
    setFieldClimateData(row);
    setIsModalFieldClimateRequestOpen(true);
  };

  const handleOkFieldClimateInfoCancel = () => {
    setIsModalFieldClimateRequestOpen(!isModalFieldClimateRequestOpen);
  };

  const sendApprovedHandler = async () => {
    try {
      const data = {
        id,
        data: {
          category: confirmationTypeId as number,
        },
      };
      await dispatch(approveRequest(data)).unwrap();
      await setIsModalFieldClimateRequestOpen(false);

      const dataRequests = {
        query: {
          page: 1,
        },
      };

      await dispatch(fetchRequests({ data: dataRequests }));
    } catch (e) {
      message.error('Не удалось принять запрос');
      await setIsModalFieldClimateRequestOpen(false);
    }
  };

  const pagePrevHandler = () => {
    setFilters({
      ...filters,
      page: filters.page - 1,
    });
  };

  const pageNextHandler = () => {
    setFilters({
      ...filters,
      page: Number(getPageNumber(requestsPagination?.next)) + 1,
    });
  };

  const onClick = () => {
    setIsModalRequestOpen(false);
    const data = {
      query: {
        page: filters?.page,
      },
    };
    dispatch(fetchRequests({ data }));
  };

  const handleOkCancel = () => {
    setIsModalRequestOpen(false);
    const data = {
      query: {
        page: filters?.page,
      },
    };
    dispatch(fetchRequests({ data }));
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [objName, propName] = name.split(',');
    setData((prevData: IMyData | any) => {
      const updatedObj = { ...prevData?.data?.[objName], [propName]: value };
      return { ...prevData, data: { ...prevData?.data, [objName]: updatedObj } };
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (fileSizeValidate(files[0]) && fileValidateImg(files[0])) {
        setImages({
          ...images,
          image: files[0],
          deleted_image: userInfo?.uploaded_files?.[0]?.id as string,
        });
      }
    }
  };

  const onClickApproveChangeProfileDataHandler = async () => {
    try {
      const changeUserObj: any = {
        object_id: id,
      };

      changeUserObj.data = data;

      const formData = new FormData();

      for (const name in changeUserObj) {
        if (name === 'data') {
          appendDataFieldsAndDeleteEmptyKeys(formData, changeUserObj[name]);
        } else {
          formData.append(name, changeUserObj[name]);
        }
      }

      if (images?.image !== null) {
        formData.append('files', images?.image as Blob);
      }
      if (images?.deleted_image !== undefined && images?.deleted_image !== null) {
        formData.append('deleted_image', images?.deleted_image as string);
      }

      await dispatch(requestApproveChangeProfile({ id: userInfo?.id, data: formData })).unwrap();

      const dataRequests = {
        query: {
          page: 1,
        },
      };

      await dispatch(fetchRequests({ data: dataRequests }));
      await setIsModalUserInfoRejectOpen(false);
    } catch (e) {
      await setIsModalUserInfoRejectOpen(false);
      await message.error('Произошла ошибка.');
    }
  };

  const confirmationTypeHandler = (row: Requestor) => {
    switch (row?.category) {
      case 2:
        setId(row?.id);
        setConfirmationTypeId(row?.category);
        showUserInfoModal();
        break;
      case 3:
        setId(row?.id);
        setConfirmationTypeId(row?.category);
        showTechniqueModal(row);
        break;
      case 4:
        setId(row?.id);
        setConfirmationTypeId(row?.category);
        showFieldClimateInfoModal(row);
        break;
      default:
        setId(row?.id);
        setConfirmationTypeId(row?.category);
        showRegisterUserModal();
    }
  };

  const columns: ColumnsType<Requestor> = [
    {
      dataIndex: 'category',
      filterSearch: true,
      width: '10%',
      fixed: 'left',
      render: (text, row) => {
        const categoryToImage: { [key: number]: string } = {
          2: user,
          3: tractorRequest,
          4: sun,
        };
        const defaultImage = newUser;
        const imageSource = categoryToImage[row?.category] || defaultImage;

        return <img alt='info' src={imageSource} />;
      },
    },
    {
      title: 'Дата запроса',
      dataIndex: 'created_at',
      width: '20%',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (text: string) => {
        return <p>{moment(text, dateMomentTypeDash).format(dateMomentTypeDash)}</p>;
      },
    },
    {
      title: 'Тип запроса',
      dataIndex: 'category',
      filterSearch: true,
      width: '35%',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (text, row) => {
        let confirmationTypeText;
        switch (row?.category) {
          case 2:
            confirmationTypeText = 'Личная информация';
            break;
          case 3:
            confirmationTypeText = 'Добавление техники';
            break;
          case 4:
            confirmationTypeText = 'Запрос на подключение метеосервиса';
            break;
          default:
            confirmationTypeText = 'Регистрация нового профиля';
            break;
        }
        return <p>{confirmationTypeText}</p>;
      },
    },
    {
      title: 'Источник запроса',
      dataIndex: 'requestor',
      filterSearch: true,
      width: '45%',
      render: (text, row) => {
        return (
          <>
            <span>{row?.requestor as string}</span>
            <Tooltip
              title='Просмотреть запрос'
              color='#BBBBBB'
              overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            >
              <Button className={b('btn')} type='link' onClick={() => confirmationTypeHandler(row)}>
                <EyeOutlined style={{ fontSize: '20px' }} />
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  if (fetchRequestsError) {
    return <Errors status={fetchRequestsError?.status} detail={fetchRequestsError?.detail} />;
  }

  return (
    <>
      <div className={b()} data-testid='requests-id'>
        <div className={b('table')}>
          <Title level={3} data-testid='sign_in_test' className={b('title')}>
            Запросы
          </Title>

          <TableComponent
            loading={fetchRequestsLoading}
            columns={columns}
            onChange={handleTableSortChange}
            data={requests}
            rowKey={(record) => record.id as number}
            params={
              fetchRequestsLoading ? { previous: null, next: null, count: 0 } : requestsPagination
            }
            pagePrevHandler={pagePrevHandler}
            pageNextHandler={pageNextHandler}
          />
        </div>
      </div>

      <ModalComponent
        dividerShow={false}
        title='Запрос на добавление техники'
        open={isModalTechniqueOpen}
        handleOk={handleOkTechniqueCancel}
        handleCancel={handleOkTechniqueCancel}
      >
        {errors ? (
          <Errors status={errors.status} detail={errors.detail} />
        ) : (
          <RequestAddTechnique
            loading={loading}
            modalOpen={() => {
              setIsModalRequestOpen(!isModalRequestOpen);
              setIsModalTechniqueOpen(!isModalTechniqueOpen);
            }}
            resultsTechnique={results}
            handleOkCancel={handleOkTechniqueCancel}
            showRejectModal={showRejectModal}
          />
        )}
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        title='Запрос на регистрацию'
        open={isModalRegisterUserOpen}
        handleOk={handleOkRegisterUserCancel}
        handleCancel={handleOkRegisterUserCancel}
      >
        {userInfoError ? (
          <Errors status={userInfoError.status} detail={userInfoError.detail} />
        ) : (
          <RequestRegisterUser
            userInfo={userInfo}
            userId={id}
            userInfoLoading={userInfoLoading}
            handleOkCancel={handleOkRegisterUserCancel}
            showRejectModal={showRejectModal}
          />
        )}
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        title='Запрос на изменение личной информации'
        open={isModalUserInfoOpen}
        handleOk={handleOkUserInfoCancel}
        handleCancel={handleOkUserInfoCancel}
      >
        <EditUserProfileModal
          handleOkCancel={handleOkUserInfoCancel}
          showRejectModal={showRejectModal}
          changeUserInfoRequest
          userInfo={userInfo}
          userId={id}
          userInfoLoading={userInfoLoading}
          inputChangeHandler={inputChangeHandler}
          image={images?.image}
          onFileChange={onFileChange}
          loading={requestApproveChangeProfileLoading}
          onClick={onClickApproveChangeProfileDataHandler}
        />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        open={isModalFieldClimateRequestOpen}
        handleOk={handleOkFieldClimateInfoCancel}
        handleCancel={handleOkFieldClimateInfoCancel}
      >
        <FieldClimateModal
          approveRequestLoading={approveRequestLoading}
          fieldClimateData={fieldClimateData}
          sendApprovedHandler={sendApprovedHandler}
          handleOkCancel={showRejectModal}
        />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        open={isModalRejectOpen}
        handleOk={handleOkRejectCancel}
        handleCancel={handleOkRejectCancel}
      >
        <RequestModal
          title='Отклонить?'
          textCancel='Отклонить'
          loading={vehicleDeleteLoading}
          subTitle='Вы уверены, что хотите отклонить запрос'
          handleDeleteCancel={handleOkRejectCancel}
          requestHandler={rejectHandler}
        />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        closable={false}
        open={isModalRequestOpen}
        handleCancel={handleOkCancel}
      >
        <RequestModals onClick={onClick} />
      </ModalComponent>
    </>
  );
};

export default UserRequests;
