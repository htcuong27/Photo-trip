import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
// import { reducer as form } from 'redux-form';
import Auth from './modules/Auth';
import FileManager from './modules/FileManager';
// import notifs from './modules/notifs';
// import counter from './modules/counter';
// import info from './modules/info';
// import notiPopup from './modules/notiPopup';
import Main from './modules/Main';
import Cart from './modules/Cart';
import Category from './modules/Category';
import Search from './modules/Search';
import Product from './modules/Product';
import Notification from './modules/Notification';
import Person from './modules/Person';
import Profile from './modules/Profile';
import Department from './modules/Department';
import Task from './modules/Task';
// import widgets from './modules/widgets';
// import survey from './modules/survey';
// import chat from './modules/chat';
import Chat from './modules/Chat';
import Download from './modules/Download';

export default function createReducers(asyncReducers) {
  return {
    routing: routerReducer,
    reduxAsyncConnect,
    online: (v = true) => v,
    // form,
    // notifs,
    Auth,
    // info,
    Person,
    // notiPopup,
    Main,
    Category,
    Cart,
    Search,
    Product,
    Notification,
    FileManager,
    Profile,
    Department,
    Task,
    // widgets,
    // survey,
    // chat,
    Chat,
    Download,
    ...asyncReducers
  };
}
