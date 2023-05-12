import { Button, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';

import cloud from 'assets/images/icons/cloud.svg';
import FormField from 'components/FormField/FormField';
import { RequestType } from 'types/types';
import 'components/ModalComponent/ModalChildrenComponents/FieldClimateModal/_fieldClimateModal.scss';

const { Title } = Typography;

interface Props {
  fieldClimateData: RequestType | null;
  handleOkCancel: () => void;
  sendApprovedHandler: () => void;
  approveRequestLoading: boolean;
}

const FieldClimateModal: React.FC<Props> = ({
  handleOkCancel,
  sendApprovedHandler,
  fieldClimateData,
  approveRequestLoading,
}) => {
  const b = bem('FieldClimateModal');
  const [form] = Form.useForm();

  useEffect(() => {
    if (fieldClimateData) {
      form.setFieldsValue({
        requestor: fieldClimateData?.requestor,
      });
    }
  }, [fieldClimateData]);

  return (
    <div>
      <img src={cloud} alt='cloud' />
      <Title level={3}>Запрос на подключение метеосервиса</Title>

      <Form form={form} initialValues={{ remember: true }} autoComplete='off' layout='vertical'>
        <div className={b('form-modal-block')}>
          <FormField
            readOnly
            data-testid='requestor_id'
            id='requestor_id'
            inputClassName={b('username-info')}
            label='Источник запроса'
            name='requestor'
            placeholder='Источник запроса'
          />
        </div>
      </Form>

      <div className={b('profile-buttons')}>
        <Button
          type='primary'
          style={{ width: '100%', borderRadius: 4 }}
          className={b('delete-button')}
          onClick={handleOkCancel}
        >
          Отклонить запрос
        </Button>

        <Button
          type='primary'
          htmlType='submit'
          loading={approveRequestLoading}
          style={{ width: '100%', borderRadius: 4 }}
          className={b('save-button')}
          onClick={sendApprovedHandler}
        >
          Принять
        </Button>
      </div>
    </div>
  );
};

export default FieldClimateModal;
