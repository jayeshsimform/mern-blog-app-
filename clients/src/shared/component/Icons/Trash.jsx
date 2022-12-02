import React from 'react';
import TrashStatic from '../../../images/trash.png';
import './Icon.scss'

const Trash = (
    { id,
        onClick = () => { }
    }
) => {

    return (
        <div className='trash'>
            <img src={TrashStatic} alt="" onClick={() => { onClick(id) }} />
        </div>
    );
}


export default Trash;