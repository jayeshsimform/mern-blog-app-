import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context'
import { useForm, useHttpClient } from '../../shared/hooks';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import UserWidget from './component/UserWidget';
import Input from '../../shared/component/input/input';
import Button from '../../shared/component/Button/Button';
import Snackbar from '../../shared/component/Snackbar/Snackbar';
import Loader from '../../shared/component/Loader/Loader';
import TagsInput from '../../shared/component/TagsInput/TagsInput';
import './AddBlog.scss'

const EditBlog = () => {
    const [tags, setTags] = useState([]);
    const auth = useContext(AuthContext);
    const params = useParams();
    const postId = params?.id
    const {
        isLoading,
        error,
        sendRequest,
        clearError
    } = useHttpClient();
    const navigate = useNavigate();

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_API_URL}post/${postId}`,
                    "GET",
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth?.user?.token
                    }
                );
                setTags(responseData?.post?.tags);

                await setFormData(
                    {
                        title: {
                            value: responseData?.post?.title,
                            isValid: true
                        },
                        description: {
                            value: responseData?.post?.description,
                            isValid: true
                        }
                    },
                    true
                );

            }
            catch (err) {

            }
        }
        getBlogs();


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendRequest, postId, setFormData]);

    const onBlogSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendRequest(
                process.env.REACT_APP_API_URL + 'post/' + params.id,
                "PATCH",
                JSON.stringify({
                    title: formState?.inputs?.title?.value,
                    description: formState?.inputs?.description?.value,
                    tags: tags
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth?.user?.token
                }
            )
            navigate('/')
        }
        catch (err) { }
    }

    const addTags = event => {
        if (event.key === "Enter" && event.target.value !== "") {
            setTags([...tags, event.target.value]);

            event.target.value = "";
        }
    };
    const removeTags = indexToRemove => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
    };


    return (
        <div className='container'>
            {error && <Snackbar type='error' error={error} clearError={clearError} />}
            {
                isLoading && <Loader asOverlay />
            }
            {!isLoading &&

                <div className='main'>
                    <div className='row'>
                        <div className='col-lg-8 mb-20'>
                            <div className='card pitch'>
                                <header className='auth-content'>
                                    <h1>Edit blog</h1>
                                    <p></p>
                                </header>
                                <form>

                                    <Input
                                        id="title"
                                        type="text"
                                        label="Title"
                                        errorText="Please enter a title"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        onInput={inputHandler}
                                        initialValue={formState.inputs.title.value}
                                        initialValid={true}
                                    />
                                    <Input
                                        id="description"
                                        type="textarea"
                                        label="Description"
                                        rows="5"
                                        errorText="Please enter a description, at least 30 characters"
                                        validators={[VALIDATOR_MINLENGTH(30)]}
                                        onInput={inputHandler}
                                        initialValue={formState?.inputs?.description?.value}
                                        initialValid={true}
                                    />
                                    <TagsInput
                                        addTags={addTags}
                                        setTags={setTags}
                                        removeTags={removeTags}

                                        tags={tags} />
                                    <div className="input-container center">
                                        <Button
                                            onClick={onBlogSubmit}
                                            type="button"
                                            disabled={!formState.isValid}>
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className='col-lg-4 '>
                            <UserWidget user={auth?.user} tags={tags} />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default EditBlog;