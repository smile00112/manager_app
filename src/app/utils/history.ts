import { createBrowserHistory, Location } from 'history';

type LocationState = {
  from: Location;
};

const history = createBrowserHistory<LocationState>();
// const history = createBrowserHistory(
//     {
//       basename: process.env.PUBLIC_URL
//     }
// );


export default history;
