import React from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.scss'

const PageNotFound = () => {
    return (
        <div className='center'>
            <article className='content'>
                <p>Damnit stranger,</p>
                <p>You got lost in the <strong>404</strong> galaxy.</p>
                <p>
                    <Link to={'/'}>Go back to earth.</Link>
                </p>
            </article>
        </div>
    );
}



export default PageNotFound;