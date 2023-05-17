import { Skeleton } from 'antd';
import bem from 'easy-bem';
import React from 'react';

type Props = {
  active: boolean;
  titleBool?: boolean;
  num: number;
};

const SkeletonBlock: React.FC<Props> = ({ active = false, titleBool = false, num = 0 }) => {
  const b = bem('SkeletonBlock');

  const styleCss = {
    width: 400,
    height: 500,
    marginTop: 20,
  };

  return (
    <>
      {titleBool ? (
        <div>
          <Skeleton.Button
            size='small'
            active={active}
            style={{
              width: '100%',
              marginTop: 30,
            }}
          />
        </div>
      ) : null}
      <div data-testid='loading' className={b()}>
        {[...Array(Number(num))].map(() => {
          return (
            <div key={Math.floor(new Date().valueOf() * Math.random())} style={styleCss}>
              <div className={b('block_text_skeleton')}>
                <Skeleton active={active} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SkeletonBlock;
