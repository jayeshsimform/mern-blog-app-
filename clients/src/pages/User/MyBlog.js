import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient, useFavorite, useDeletePost } from '../../shared/hooks';
import Loader from '../../shared/component/Loader/Loader';
import Snackbar from '../../shared/component/Snackbar/Snackbar';
import BlogList from '../Blogs/component/BlogList';
import Modal from '../../shared/component/Modal/Modal';
import Button from '../../shared/component/Button/Button';
import EmptyState from '../../shared/component/EmptyState/EmptyState';


const MyBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const auth = useContext(AuthContext);

    let {
        isLoading,
        sendRequest,
        error,
        setError,
        clearError
    } = useHttpClient();


    const { toggleFavorite } = useFavorite()

    const getBlogs = useCallback(async () => {

        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_API_URL + 'post/user/my-posts',
                "GET",
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth?.user?.token
                }
            );
            setBlogs(responseData?.posts)
        }
        catch (err) { }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getBlogs()
    }, [getBlogs])

    const onFavoriteHandle = async (blogId, isFavorite) => {
        const errMsg = await toggleFavorite(blogId, isFavorite, getBlogs);
        setError(errMsg)
    }

    const {
        showConfirmModal,
        onDeletePlaceHandler,
        onConfirmModalHandler
    } = useDeletePost(getBlogs, setError);


    return (
        <div className='container'>
            <div className='main'>
                {error ? <Snackbar type='error' error={error} clearError={clearError} /> : ""}

            </div>
            {isLoading ? <Loader asOverlay /> :

                blogs.length > 0 ? blogs && blogs.map((blog) => {
                    return (
                        <BlogList
                            blog={blog}
                            key={blog?.id}
                            ToggleFavorite={onFavoriteHandle}
                            onConfirmModalHandler={onConfirmModalHandler}
                        />)
                })
                    : <EmptyState />
            }
            <Modal
                show={showConfirmModal}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={<>
                    <Button disabled={isLoading} inverse onClick={onConfirmModalHandler}>Cancel</Button>
                    <Button disabled={isLoading} danger onClick={onDeletePlaceHandler}>Delete</Button>
                </>}>
                <p>Do you want to proceed and delete this post? please note that it can't be undone thereafter.</p>
            </Modal>
        </div>
    );
}

export default MyBlog;