import React from 'react';
import './Loader.scss'
const Loader = ({ asOverlay }) => {
    return (
        <div className={`${asOverlay && 'loading-spinner__overlay'}`}>
            <div className="lds-dual-ring"></div>
        </div>
    );
}


export default Loader;