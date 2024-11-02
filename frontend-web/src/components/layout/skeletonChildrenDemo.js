import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

const SkeletonChildrenDemo = () => {

    return (
        <div>
            <div className="w-[960px]">

                <Skeleton variant="rectangular" width="960px">
                    <div style={{ paddingTop: '550px', borderRadius: '10px' }} />
                </Skeleton>

                <Box sx={{ margin: 1 }}>
                    <Box>
                        <Skeleton width="450px">
                            <Typography>.</Typography>
                        </Skeleton>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ margin: 1 }}>
                        <Skeleton variant="circular">
                            <Avatar />
                        </Skeleton>
                    </Box>
                    <Box sx={{ margin: '0 10px' }}>
                        <Skeleton width="250px">
                            <Typography>.</Typography>
                        </Skeleton>
                    </Box>
                    <Box sx={{ margin: '0 225px' }}>
                        <Skeleton width="400px">
                            <Typography>.</Typography>
                        </Skeleton>
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default SkeletonChildrenDemo;