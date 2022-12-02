/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { convertDate } from '../../../shared/utils/commonFunctions';
import { AuthContext } from '../../../shared/context/auth-context';
import LikeUnlike from '../../../shared/component/LikeUnlike/LikeUnlike';
import Trash from '../../../shared/component/Icons/Trash';
import Note from '../../../images/note.png';
import './BlogList.scss'

const BlogList = ({
    blog,
    ToggleFavorite = () => { },
    onConfirmModalHandler = () => { }
}) => {
    const auth = useContext(AuthContext);
    const isUser = blog?.userId.id === auth?.user?.userId;

    return (
        <div className="col-lg-6 col-md-6">
            <div className="post-card">
                <div className="post-card-image">

                    <Link to={`/blog/${blog.id}`}>
                        <img src={process.env.REACT_APP_FILE_PATH_URL + blog?.image} alt={blog.title} />
                    </Link>

                </div>

                <div className="post-card-content">
                    {blog?.tags?.map((tag) => {
                        return <label key={tag} className="categorie">{tag}</label>
                    })
                    }
                    <h5>
                        <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                    </h5>
                    <p>{blog.description} </p>
                    <div className="post-card-info">
                        <ul className="list-inline">
                            <li>
                                <a href="#">
                                    <img src={process.env.REACT_APP_FILE_PATH_URL + blog?.userId.image} alt={blog.title} />
                                </a>
                            </li>
                            <li>
                                <span className='d-block user-name'>{blog?.userId.name}</span>
                                <span lassName='d-block'> {convertDate(blog?.created_time)}</span>
                            </li>

                        </ul>
                        <ul className="list-inline">
                            {isUser &&
                                <>
                                    <li className='custom_tooltip_wrapper'>
                                        <div className="custom_tooltip tooltip__dang">
                                            {blog?.isFavorite ? "Remove from favorite" : "Add to favorite"}
                                        </div>
                                        <LikeUnlike blogId={blog?.id} isFavorite={blog?.isFavorite} onButtonClick={ToggleFavorite} />
                                    </li>
                                </>}

                            {isUser && <>
                                <li className="dot"></li>
                                <li className='custom_tooltip_wrapper'>
                                    <div className="custom_tooltip tooltip__dang">
                                        Delete post
                                    </div>
                                    <Trash onClick={(e) => { onConfirmModalHandler(blog?.id) }} />

                                </li>
                            </>
                            }
                            {isUser && <>
                                <li className="dot"></li>
                                <li className='custom_tooltip_wrapper'>
                                    <div className="custom_tooltip tooltip__dang">
                                        Edit post
                                    </div>
                                    <Link to={`/blog/${blog?.id}/edit`}>
                                        <img src={Note} alt="" className='note' />
                                    </Link>

                                </li>
                            </>
                            }
                        </ul>
                    </div>

                </div>
            </div>

        </div>
    );
}


export default BlogList;