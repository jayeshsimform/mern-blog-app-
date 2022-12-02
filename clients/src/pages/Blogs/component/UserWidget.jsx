import React from 'react';
import './UserWidget.scss'

const UserWidget = ({ user = {} }) => {
    return (
        user?.name ?
            <div className='widget'>
                <div className="widget-author" >
                    <label className="image">
                        <img src={process.env.REACT_APP_FILE_PATH_URL + user?.image} alt={user?.name} />
                    </label>
                    <h6>
                        <span>Hi, I'm {user?.name}</span>
                    </h6>
                    <p>
                        Hi, I'm {user?.name} - {user?.description}
                    </p>
                </div >
            </div >
            : ""
    );
}

export default UserWidget;