import React from 'react';
import Like from '../Icons/Like';
import UnLike from '../Icons/UnLike';
const LikeUnlike = ({
    blogId = '',
    isFavorite = false,
    onButtonClick = () => { }
}
) => {

    return (
        <span className='pointer'>
            {
                !isFavorite ?
                    <Like onClick={() => { onButtonClick(blogId, true) }} /> :
                    <UnLike onClick={() => { onButtonClick(blogId, false) }} />
            }
        </span>
    );
}
export default LikeUnlike;