import React from 'react';
import './Snackbar.scss'
const Snackbar = (
    {
        type = 'success',
        error,
        clearError = () => { }
    }
) => {
    return (
        <div id="snackbar"
            className={
                type === 'error' ? 'snackbar-error show' : "snackbar-success"
            }>{error} <b className='close-btn' onClick={clearError}>X</b></div>
    );
}


export default Snackbar;