import React from 'react';
import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';
// import { navigationRoutes } from '../../../router/routes';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import MenuIcon from '@mui/icons-material/Menu';
// import Typography from '@mui/material/Typography';
import Container from '../Container';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Switch from '@mui/material/Switch';
import {useAppDispatch} from '../../../store/createStore';
import {updateSearch, getSearch, getNotificationHistory} from '../../../store/orders'
import { logOut } from '../../../store/users';
import {OrdersFilter} from '../../ui/panels/ordersFilters/ordersFilter'
import {OrdersNotification} from '../../ui/panels/ordersNotification/ordersNotification'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import addNotification from 'react-push-notification';
import showToast from '../../../utils/message';
import {getClientToken, getNotificationStatus} from "../../../services/firebase.service";

//import history from '../../../utils/history';

const switchLabel = { inputProps: { 'aria-label': 'Notification' } };
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));
const Header: React.FC = () => {

  // const isLoggedIn = useSelector(getIsLoggedIn());
  // const authErrors = useSelector(getAuthErrors());
    const dispatch = useAppDispatch();

    const notificationHistory = useSelector(getNotificationHistory());

    const searchString = useSelector(getSearch());
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleExit = (event) => {
        if( window.confirm('Желаете выйти?') ){
            dispatch(logOut());
        };
    };
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    //filter
    const [statusFilterHandle, setStatusFilterHandle] = React.useState(false);
    const [statusNotifHandle, setStatusNotifHandle] = React.useState(false);

    const handleFilterClose = () => {
        setStatusFilterHandle(false)
    };
    const handleNotifClose = () => {
        setStatusNotifHandle(false)
    };
    const handleFilterOpen = () => (event) => {
        setStatusFilterHandle(true)
        handleMobileMenuClose();
        event.stopPropagation();

    }
    const handleNotificationOpen = () => (event) => {
        setStatusNotifHandle(true)
        handleMobileMenuClose();
        event.stopPropagation();

    }


    const [notifChecked, setNotifChecked] = React.useState(false);
    // const handleChange = (event) => {
    //     setChecked(event.target.checked);
    // };
    const testNotif = (event) => {
        if(event.target.checked) {
            getClientToken().then(data => {
                if (data === true) {
                    showToast('Уведомения включены', 'info')
                }

                setNotifChecked(data === true);
            });
        }

    }

    const filtration = (data) => (event) => {
        console.warn('filtration', data)
        event.stopPropagation();
        // setStatusFilterHandle(true)
    }
    //filter

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            <MenuItem onClick={handleFilterOpen()}>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit" >
                    <Badge badgeContent={0} color="error">
                        <FilterAltIcon />
                    </Badge>
                </IconButton>
                <p>Фильтр</p>
            </MenuItem>
            <MenuItem className={notifChecked === false ? '' : 'menu_hidden'}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={0} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                <Switch
                    {...switchLabel}
                    // onClick={testNotification()}
                    checked={notifChecked}
                    onChange={testNotif}
                />

                {/*<p>Вкл пуш</p>*/}
            </MenuItem>
            <MenuItem  onClick={handleNotificationOpen()}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={notificationHistory.length} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Уведомления</p>
            </MenuItem>
            <MenuItem  onClick={handleExit}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <ExitToAppIcon />
                </IconButton>
                <p>Выход</p>
            </MenuItem>


            {/*<MenuItem onClick={handleProfileMenuOpen}>*/}
            {/*    <IconButton*/}
            {/*        size="large"*/}
            {/*        aria-label="account of current user"*/}
            {/*        aria-controls="primary-search-account-menu"*/}
            {/*        aria-haspopup="true"*/}
            {/*        color="inherit"*/}
            {/*    >*/}
            {/*        <AccountCircle />*/}
            {/*    </IconButton>*/}
            {/*    <p>Profile</p>*/}
            {/*</MenuItem>*/}
        </Menu>
    );

    const updateSearchInput = (event) => {
        console.log(event.target.value)
        dispatch(updateSearch(event.target.value))
        //this.setState({username : event.target.value})
    }





  return (
    <header className='header'>
      <Container>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        {/*<IconButton*/}
                        {/*    size="large"*/}
                        {/*    edge="start"*/}
                        {/*    color="inherit"*/}
                        {/*    aria-label="open drawer"*/}
                        {/*    sx={{ mr: 2 }}*/}
                        {/*>*/}
                        {/*    <MenuIcon />*/}
                        {/*</IconButton>*/}
                        {/*<Typography*/}
                        {/*    variant="h6"*/}
                        {/*    noWrap*/}
                        {/*    component="div"*/}
                        {/*    sx={{ display: { xs: 'none', sm: 'block' } }}*/}
                        {/*>*/}
                        {/*    MUI*/}
                        {/*</Typography>*/}
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Поиск…"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={updateSearchInput}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton size="large" aria-label="Фильтр" color="inherit"
                                onClick={handleFilterOpen()}
                            >
                                <Badge badgeContent={0} color="error">
                                    <FilterAltIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                size="large"
                                aria-label="Уведомления"
                                color="inherit"
                                onClick={handleNotificationOpen()}
                            >
                                <Badge badgeContent={notificationHistory.length} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                                onClick={handleExit}
                            >
                                <ExitToAppIcon />
                            </IconButton>

                            {/*<IconButton*/}
                            {/*    size="large"*/}
                            {/*    edge="end"*/}
                            {/*    aria-label="account of current user"*/}
                            {/*    aria-controls={menuId}*/}
                            {/*    aria-haspopup="true"*/}
                            {/*    onClick={handleProfileMenuOpen}*/}
                            {/*    color="inherit"*/}
                            {/*>*/}
                            {/*    <AccountCircle />*/}
                            {/*</IconButton>*/}
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                {renderMenu}
            </Box>

          <OrdersFilter
              openFilterState={statusFilterHandle}
              closeFilter={handleFilterClose}
              filtration={filtration}
          ></OrdersFilter>

          <OrdersNotification
              openNotifState={statusNotifHandle}
              closeNotification={handleNotifClose}
              notifications={notificationHistory}
          ></OrdersNotification>
            {/*<Logo className='header__logo' />
        <NavList routes={navigationRoutes} className='header-nav' />
          {isLoggedIn && !authErrors ? (
            <>
              <Divider orientation='vertical' flexItem className='header__divider' />
              <NavProfile />
            </>
          ) : (
            <div className='header-buttons'>
              <NavLink to='/login/signIn' className='header-buttons-button'>
                <Button size='small' variant='outlined'>
                  Войти
                </Button>
              </NavLink>
              <NavLink to='/login/signUp' className='header-buttons-button'>
                <Button size='small'>Зарегистрироваться</Button>
              </NavLink>
            </div>
          )} */}
      </Container>
    </header>
  );
};

export default React.memo(Header);
