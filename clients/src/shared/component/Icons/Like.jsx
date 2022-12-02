import React from 'react';
import ribbon from '../../../images/ribbon.png';
import './Icon.scss'
const Like = ({
    onClick = () => { }
}) => {
    return (
        <img src={ribbon} alt="" className='like_img' onClick={onClick} />
    );
}
export default Like;