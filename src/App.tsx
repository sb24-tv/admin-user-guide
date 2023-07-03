import {Suspense, lazy} from 'react';
import {Route, Routes} from 'react-router-dom';
import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';

import useMiddleware from "./hooks/useMidleware.ts";

const Calendar = lazy(() => import('./pages/Calendar'));
const Chart = lazy(() => import('./pages/Chart'));
const FormElements = lazy(() => import('./pages/Form/FormElements'));
const FormLayout = lazy(() => import('./pages/Form/FormLayout'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Tables = lazy(() => import('./pages/Tables'));
const Alerts = lazy(() => import('./pages/UiElements/Alerts'));
const Buttons = lazy(() => import('./pages/UiElements/Buttons'));
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const Category = lazy(() => import('./pages/category/Category'));
const Content = lazy(() => import('./pages/content/Content'));
const CreateContent = lazy(() => import('./pages/content/CreateContent'));
const User = lazy(() => import('./pages/user/User'));
const Loader = lazy(() =>  import('./common/Loader') );
const CreateCategory = lazy(() => import('./pages/category/CreateCategory'));

function App() {
    const [isLogin] = useMiddleware();
    return isLogin ? (
        <Suspense fallback={ <Loader/>}>
            <Routes>
                <Route element={<DefaultLayout/>}>
                    <Route path="/" element={<ECommerce/>}/>
                    <Route
                        path="/calendar"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Calendar/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/category"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Category/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/category/create"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <CreateCategory/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/content"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Content/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/content/create"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <CreateContent/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/user"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <User/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Profile/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/forms/form-elements"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <FormElements/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/forms/form-layout"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <FormLayout/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/tables"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Tables/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Settings/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/chart"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Chart/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/ui/alerts"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Alerts/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/ui/buttons"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Buttons/>
                            </Suspense>
                        }
                    />
                </Route>


            </Routes>
        </Suspense>
    ) : <SignIn/>;
}

export default App;
