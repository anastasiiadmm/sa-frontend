import { Button, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';

import sun from 'assets/images/icons/sun-large.svg';
import FormField from 'components/FormField/FormField';
import { Requestor } from 'interfaces';
import 'components/ModalComponent/ModalChildrenComponents/FieldClimateModal/_fieldClimateModal.scss';

const { Title } = Typography;

interface Props {
  fieldClimateData: Requestor | null;
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
      <img src={sun} alt='sun' style={{ width: 56, height: 56 }} />
      <Title
        level={3}
        style={{
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Запрос на подключение метеосервиса
      </Title>

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
          htmlType='submit'
          loading={approveRequestLoading}
          style={{ width: '100%', borderRadius: 6 }}
          className={b('save-button')}
          onClick={sendApprovedHandler}
        >
          Принять
        </Button>
        <Button
          type='primary'
          style={{ width: '100%', borderRadius: 6 }}
          className={b('delete-button')}
          onClick={handleOkCancel}
        >
          Отклонить запрос
        </Button>
      </div>
    </div>
  );
};

export default FieldClimateModal;
