import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAuth } from './shared/hooks/auth-hook';
import { AuthContext } from './shared/context/auth-context';
import Header from './shared/component/header/Header';
import Loader from './shared/component/Loader/Loader';
import './style/style.scss';

const Signup = React.lazy(() => import('./pages/Auth/Signup'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Blogs = React.lazy(() => import('./pages/Blogs/Blogs'));
const Blog = React.lazy(() => import('./pages/Blogs/Blog'));
const AddBlog = React.lazy(() => import('./pages/Blogs/AddBlog'));
const Profile = React.lazy(() => import('./pages/User/Profile'));
const Favorite = React.lazy(() => import('./pages/User/Favorite'));
const MyBlog = React.lazy(() => import('./pages/User/MyBlog'));
const Verify = React.lazy(() => import('./pages/User/Verify'));
const EditBlog = React.lazy(() => import('./pages/Blogs/EditBlog'));
const PageNotFound = React.lazy(() => import('./shared/component/PageNotFound/PageNotFound'));
const ForgotPassword = React.lazy(() => import('./pages/User/ForgotPassword'))


function App() {
  const {
    user,
    login,
    logout,
  } = useAuth();


  let routes;
  if (user?.token) {
    routes = (
      <>
        <Route exact path="/user/profile" element={<Profile />} />
        <Route exact path="/user/favorite" element={<Favorite />} />
        <Route exact path="/user/my-blog" element={<MyBlog />} />
        <Route exact path="/user/new-blog" element={<AddBlog />} />
        <Route exact path="/blog/:id/edit" element={<EditBlog />} />
      </>
    )
  }
  else {
    routes = (
      <>
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/user/:id/verify/:token" element={<Verify />} />
        <Route exact path="/user/:id/verify-password/:token" element={<ForgotPassword />} />
      </>
    )
  }

  return (
    <>
      <AuthContext.Provider
        value={
          {
            isLoggedIn: !!user?.token,
            user: user,
            login: login,
            logout: logout
          }
        }
      >
        <BrowserRouter>
          <Header />
          <main>
            <Suspense fallback={<div className='center'><Loader asOverlay /></div>}>
              <Routes>
                {routes}
                <Route exact path="/" element={<Blogs />} />
                <Route exact path="/blog/:id" element={<Blog />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </main>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
}

export default App;
