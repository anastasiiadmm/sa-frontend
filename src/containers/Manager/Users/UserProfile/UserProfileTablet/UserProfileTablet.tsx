import { Form, message } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import { IAccount } from 'interfaces';
import {
  companiesSelector,
  fetchUserInfoByManager,
  setChangeUserProfile,
  updateUserInfo,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getErrorMessage, inputChangeFormHandler } from 'utils/helper';
import 'containers/Manager/Users/UserProfile/UserProfileTablet/_userProfileTablet.scss';

const UserProfileTablet = () => {
  const { id } = useParams() as { id: string };
  const b = bem('UserProfileTablet');
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const [form] = Form.useForm();
  const { userInfoByManager } = useAppSelector(companiesSelector);
  const { updateUserData, updateUserInfoLoading } = useAppSelector(companiesSelector);
  const [userInfoData, setUserInfoData] = useState<IAccount>({
    coords_timeout: 0,
    email: '',
    first_name: '',
    image: '',
    is_manager: false,
    last_name: '',
    middle_name: '',
    phone: '',
    username: '',
    company: {
      autopilots_amount: 0,
      location: '',
      meteo_requested: false,
      name: '',
      vehicles_number: 0,
      weather_service: false,
    },
  });
  const [formValid, setFormValid] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserInfoByManager({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (userInfoByManager) {
      dispatch(setChangeUserProfile(userInfoByManager));
      setUserInfoData(userInfoByManager);
    }
  }, [userInfoByManager, dispatch]);

  useEffect(() => {
    if (updateUserData) {
      if ('email' in updateUserData) {
        form.setFieldsValue({
          email: updateUserData?.email,
          first_name: updateUserData?.first_name,
          image: updateUserData?.image,
          last_name: updateUserData?.last_name,
          middle_name: updateUserData?.middle_name,
          phone: updateUserData?.phone,
          username: updateUserData?.username,
          company: {
            autopilots_amount: updateUserData?.company?.autopilots_amount,
            location: updateUserData?.company?.location,
            name: updateUserData?.company?.name,
          },
        });
      }
    }
  }, [updateUserData, form]);

  const prevButtonHandler = () => {
    history(`/user-profile/${id}/`);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputChangeFormHandler(e, userInfoData, setUserInfoData);
  };

  const onFinish = async (values: IAccount) => {
    try {
      if (values) {
        await dispatch(updateUserInfo({ id, data: values })).unwrap();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
    }
  };

  return (
    <div className={b('')}>
      <EditUserProfileModal
        prevButtonHandler={prevButtonHandler}
        updateUserData={updateUserData}
        onFinish={onFinish}
        inputChangeHandler={inputChangeHandler}
        loading={updateUserInfoLoading}
        formValid={formValid}
        onValuesChange={() =>
          setFormValid(form.getFieldsError().some((item) => item.errors.length > 0))
        }
      />
    </div>
  );
};

export default UserProfileTablet;
