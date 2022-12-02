import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import './Header.scss';

const Header = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    const toggleDrawerHandler = () => {
        setDrawerIsOpen(!drawerIsOpen);
    };
    return (
        <div className='main-header'>
            {drawerIsOpen && <div className="backdrop" onClick={toggleDrawerHandler}></div>}
            <SideDrawer show={drawerIsOpen} onClick={toggleDrawerHandler} >
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>
            <button className="main-navigation__menu-btn" onClick={toggleDrawerHandler}>
                <span />
                <span />
                <span />
            </button>
            <h1 className="main-navigation__title">
                <Link to="/">Blogs</Link>
            </h1>
            <nav className="main-navigation__header-nav">
                <NavLinks />
            </nav>

        </div>
    );
}


export default Header;