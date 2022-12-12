import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context'
import { convertDate } from '../../shared/utils/commonFunctions';
import Loader from '../../shared/component/Loader/Loader';
import Snackbar from '../../shared/component/Snackbar/Snackbar';
import LikeUnlike from '../../shared/component/LikeUnlike/LikeUnlike';
import UserWidget from './component/UserWidget';
import Note from '../../images/note.png';
import Chat from '../Chat/chat';

const Blog = () => {
    const [blog, setBlog] = useState();
    const params = useParams();
    const auth = useContext(AuthContext);


    const {
        isLoading,
        sendRequest,
        error,
        clearError
    } = useHttpClient();

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_API_URL}post/${params?.id}`,
                    "GET",
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth?.user?.token
                    }
                );
                setBlog(responseData?.post)
            }
            catch (err) {

            }
        }
        getBlogs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const ToggleFavorite = async (postId, isFavorite) => {
        const responseData = await sendRequest(
            `${process.env.REACT_APP_API_URL}post/user/favorite`,
            "PATCH",
            JSON.stringify({
                postId: postId,
                isFavorite: isFavorite
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth?.user?.token
            }
        );
        console.log("eData?.post", responseData?.post)
        setBlog(responseData?.post)
    }

    const isUser = blog?.userId.id === auth?.user?.userId;
    return (
        <div className='container'>
            {isLoading && <Loader asOverlay />}
            <div className='main'>
                {error && <Snackbar type='error' error={error} clearError={clearError} />}
                {
                    blog?.title &&

                    <div className='row'>
                        <div className='col-lg-8 mb-20'>
                            <div className='post-single'>
                                <div className='post-single-image'>
                                    <img src={process.env.REACT_APP_FILE_PATH_URL + blog?.image} alt={blog?.title} />
                                </div>
                                <div className="post-single-content">
                                    <label className="categorie">travel</label>
                                    <h4>{blog?.title}</h4>
                                    <div className="post-single-info">
                                        <ul className="list-inline">
                                            <li><span> <img src={process.env.REACT_APP_FILE_PATH_URL + blog?.userId.image} alt={blog?.title} /></span></li>
                                            <li>
                                                <span className='d-block user-name'>{blog?.userId?.name}</span>
                                                <span className='d-block'>{convertDate(blog?.created_time)}</span>
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
                                <div className='post-single-body'>
                                    <p>
                                        {blog?.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4 '>
                            <UserWidget user={blog?.userId} />
                            <Chat user={blog?.userId} />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}


export default Blog;