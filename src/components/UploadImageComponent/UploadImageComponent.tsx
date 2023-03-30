import { Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
import bem from 'easy-bem';
import React from 'react';

import plug from 'assets/images/icons/image-plug.svg';
import 'components/UploadImageComponent/_uploadImageComponent.scss';

interface Props {
  fileList: UploadFile[] | [];
  setFileList: (fileList: UploadFile[]) => void;
}

const UploadImageComponent: React.FC<Props> = ({ fileList, setFileList }) => {
  const b = bem('UploadImageComponent');

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const customRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  return (
    <div style={fileList.length ? { margin: 0 } : { margin: '51px 0px 45px 66px' }}>
      <ImgCrop aspect={233 / 162}>
        <Upload
          data-testid='image-upload'
          className={b('upload-field')}
          listType='picture-card'
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          customRequest={customRequest}
          accept='image/png, image/jpeg'
        >
          {fileList.length < 1 && <img src={plug} alt='plug' />}
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default UploadImageComponent;
