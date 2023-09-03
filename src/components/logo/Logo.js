import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';
import { useSettingsContext } from '../settings';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();
  const { themeDnsData, themeMode, themeLayout } = useSettingsContext();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );
  const getLogo = () => {
    console.log(themeLayout)
    if (themeLayout == 'mini') {
      return themeDnsData.favicon_img
    } else {
      return themeDnsData?.logo_img
    }
  }
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 'auto',
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img src={getLogo()} style={{
        width: 'auto',
        height: '40px',
      }} />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={NextLink} href="#" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
