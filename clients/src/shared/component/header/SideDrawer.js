import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.scss';

const SideDrawer = ({ children, show, onClick }) => {
    return (
        <CSSTransition
            in={show}
            timeout={300}
            classNames="slide-in-left"
            mountOnEnter
            unmountOnExit
        >
            <aside className="side-drawer" onClick={onClick}>{children}</aside>
        </CSSTransition>
    )
};

export default SideDrawer;