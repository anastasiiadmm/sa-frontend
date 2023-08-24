import { Button, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
import bem from 'easy-bem';
import React from 'react';

import plug from 'assets/images/icons/image-plug.svg';
import tractorIcons from 'assets/images/icons/newIcon/tractorIcons.svg';
import 'components/UploadImageComponent/_uploadImageComponent.scss';
import useWindowWidth from 'hooks/useWindowWidth';

interface Props {
  fileList: UploadFile[] | [];
  setFileList: (fileList: UploadFile[]) => void;
}

const UploadImageComponent: React.FC<Props> = ({ fileList, setFileList }) => {
  const windowWidth = useWindowWidth();
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

  const renderPhotos = () => {
    if (fileList.length < 1 && windowWidth >= 990) {
      return <img src={plug} alt='plug' />;
    }

    if (fileList.length < 1 && windowWidth <= 990) {
      return (
        <div className={b('add_mobile_photos')}>
          <div>
            <img src={tractorIcons} alt='tractorIcons' />
            <p>Загрузите фотографию</p>
            <Button>Загрузить</Button>
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <div
      style={
        fileList.length || windowWidth <= 990 ? { margin: 0 } : { margin: '51px 0px 45px 66px' }
      }
    >
      <ImgCrop aspect={233 / 162}>
        <Upload
          data-testid='image-upload'
          className={b('upload-field')}
          listType='picture-card'
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          customRequest={(args) => {
            if (args.onSuccess) {
              args.onSuccess('ok');
            }
          }}
          accept='image/png, image/jpeg'
        >
          {renderPhotos()}
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default UploadImageComponent;
