import { createAction, createSlice } from '@reduxjs/toolkit';
import authService from '../services/auth.service';
import localStorageService, { setTokens } from '../services/localStorage.service';
import userService from '../services/user.service';
import generateAuthError from '../utils/AuthErrors';
import history from '../utils/history';

// type UserInitialState = {
//   entities: Array<UserType>;
//   isLoading: boolean;
//   error: string | null;
//   auth: {
//     userId: string | null;
//   };
//   isLoggedIn: boolean;
//   dataLoaded: boolean;
// };
const DEBUG = false;
const initialState = localStorageService.getAccessToken()
  ? {
      entities: [],
      isLoading: true,
      error: null,
      auth: { userId: localStorageService.getUserId() },
      isLoggedIn: true,
      dataLoaded: false,
     // usersDomain: process.env.REACT_APP_API_URL.replace('http://', '').replace('https://', ''),
    }
  : {
      entities: [],
      isLoading: false,
      error: null,
      auth: { userId: null },
      isLoggedIn: false,
      dataLoaded: false,
     // usersDomain: process.env.REACT_APP_API_URL.replace('http://', '').replace('https://', ''),
    };

const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    usersRequested: state => {
      state.isLoading = true;
    },
    usersReceived: (state, action) => {
      state.entities = action.payload;
      state.dataLoaded = true;
      state.isLoading = false;
    },
    usersRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = true;
    },
    authRequested: state => {
      state.error = null;
    },
    authRequestSuccess: (state, action) => {
      state.auth = action.payload;
      state.isLoggedIn = true;
    },
    authRequestFailed: (state, action) => {
      state.error = action.payload;
    },
    userCreated: (state, action) => {
      state.entities.push(action.payload);
    },
    userUpdated: (state, action) => {
      const userIndex = state.entities.findIndex(user => user._id === action.payload._id);
      state.entities[userIndex] = action.payload;
    },
    userLoggedOut: state => {
      state.isLoggedIn = false;
      state.auth.userId = null;
    },
  },
});

const { actions, reducer: usersReducer } = usersSlice;

const {
  usersRequested,
  usersReceived,
  usersRequestFailed,
  authRequested,
  authRequestSuccess,
  authRequestFailed,
  userUpdated,
  userLoggedOut,
} = actions;

const userUpdateRequested = createAction('users/userUpdateRequested');
const userUpdateRequestedFailed = createAction('users/userUpdateRequestedFailed');

export const updateUserData =
  (payload) =>
  async dispatch => {
    if(DEBUG) console.warn('dispatch updateUserData');
    dispatch(userUpdateRequested());
    try {
      const { content } = await userService.updateUserData(payload);
      dispatch(userUpdated(content));
      history.goBack();
    } catch (error) {
      dispatch(userUpdateRequestedFailed());
    }
  };

export const signIn =
  ({ payload, redirect }) =>
  async dispatch => {
    const { login, password } = payload;
    dispatch(authRequested());
    try {
      const {data} = await authService.signIn({ login, password });
      if(DEBUG) console.warn('authdata', data);
        setTokens(data.content);
        dispatch(authRequestSuccess({ userId: data.userId }));
        //history.push(redirect || process.env.PUBLIC_URL);
        history.push( process.env.PUBLIC_URL );
    } catch (error) {
       // console.warn(error);
      const { code, message } = error.response;
      if(DEBUG)  console.warn('auth error', error)
      if (code === 'rest_missing_callback_param') {
        const errorMessage = generateAuthError(message);
        dispatch(authRequestFailed(errorMessage));
      } else {
        dispatch(authRequestFailed(error.message));
      }
    }
    return false;
  };

export const signUp =
  (payload) =>
  async dispatch => {
    dispatch(authRequested());
    try {
      const data = await authService.signUp(payload);
      setTokens(data);
      dispatch(authRequestSuccess({ userId: data.userId }));
      history.push(process.env.PUBLIC_URL );
    } catch (error) {
      dispatch(authRequestFailed(error.message));
    }
  };

export const logOut = () => async dispatch => {
  localStorageService.removeAuthData();
  dispatch(userLoggedOut());
  history.push(process.env.PUBLIC_URL );
};

export const loadUsersList = () => async (dispatch, getState) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.getAll();
    dispatch(usersReceived(content));
  } catch (error) {
    dispatch(usersRequestFailed(error.message));
  }
};

export const loadUserInfo = () => async (dispatch, getState) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.getInfo();
    if(DEBUG) console.log('userService. content', content)
    dispatch(usersReceived(content));
  } catch (error) {
    dispatch(usersRequestFailed(error.message));
  }
};
export const getUsersList = () => (state) => state.users.entities;
export const getUserStock = () => (state) => state.users.entities.stock_id;
export const getUserDomain = () => (state) => state.users.entities.domain_name;
export const getUser = () => (state) => {
  return state.users.entities;
}
export const getCurrentUserData = () => (state) => {
  if (state.users.auth) {
    return state.users.entities
      ? state.users.entities.find((user) => user._id === state.users.auth.userId)
      : null;
  }
};

export const getUsersLoadingStatus = () => (state) => state.users.isLoading;
export const getUserById = (userId) => (state) => {
  if (state.users.entities) {
    return state.users.entities.find((user) => user._id === userId);
  }
};
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getCurrentUserId = () => (state) => {
  return state.users.auth.userId;
};
export const getAuthErrors = () => (state) => state.users.error;

export default usersReducer;
