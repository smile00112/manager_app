import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import Divider from '../../../common/Divider';

const OrderCardSkeleton = () => {
  return (
      <div className='order-card__skeleton'>
          <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
          >
              <Skeleton variant="rectangular" animation='wave' width={'100%'} height={50} />
              <Skeleton variant="rectangular" animation='wave' width={'100%'} height={50} />
              <Skeleton variant="rectangular" animation='wave' width={'100%'} height={50} />
              <Skeleton variant="rectangular" animation='wave' width={'100%'} height={50} />
              <Skeleton variant="rectangular" animation='wave' width={'100%'} height={50} />
              <Skeleton variant="rectangular" animation='wave' width={'100%'} height={50} />


          </Stack>
      </div>
    // <div className='room-card__skeleton'>
    //   <Skeleton variant='rectangular' animation='wave' height={150} />
    //   <Skeleton variant='text' animation='wave' height={50} />
    //   <Divider />
    //   <Skeleton variant='text' animation='wave' height={50} />
    // </div>
  );
};

export default OrderCardSkeleton;
