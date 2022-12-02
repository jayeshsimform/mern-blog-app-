import React from 'react';
import ribbon from '../../../images/ribbon-tag.png';
import './Icon.scss'
const UnLike = ({
    onClick = () => { }
}) => {
    return (
        <img src={ribbon} alt="" className='like_img' onClick={onClick} />
    );
}
export default UnLike;