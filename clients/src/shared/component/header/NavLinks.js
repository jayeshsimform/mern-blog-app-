import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import './NavLink.scss';
const NavLinks = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <>
            <ul className='nav-links'>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>

                {
                    !isLoggedIn && <li>
                        <NavLink to="/signup">Signup</NavLink>
                    </li>
                }
                {
                    !isLoggedIn && <li>
                        <NavLink to="/login">Login</NavLink>
                    </li>
                }
                {
                    isLoggedIn && <li>
                        <NavLink to="/user/new-blog">New Blog</NavLink>
                    </li>
                }
                {
                    isLoggedIn && <li>
                        <NavLink to="/user/my-blog">My Blog</NavLink>
                    </li>
                }
                {
                    isLoggedIn && <li>
                        <NavLink to="/user/favorite">Favorite</NavLink>
                    </li>
                }
                {
                    isLoggedIn &&
                    <li>
                        <NavLink
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                                navigate('/login')
                            }} to="/">Logout</NavLink>
                    </li>
                }

            </ul>

        </>
    );
}



export default NavLinks;