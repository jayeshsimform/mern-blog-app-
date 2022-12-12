import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context'
import { useForm, useHttpClient } from '../../shared/hooks';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import ImageUpload from '../../shared/component/ImageUpload/ImageUpload';
import UserWidget from './component/UserWidget';
import Input from '../../shared/component/input/input';
import Button from '../../shared/component/Button/Button';
import Snackbar from '../../shared/component/Snackbar/Snackbar';
import Loader from '../../shared/component/Loader/Loader';
import TagsInput from '../../shared/component/TagsInput/TagsInput';
import './AddBlog.scss'


//Demo commit
const AddBlog = () => {

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            },

        },
        false
    );

    const [tags, setTags] = useState([]);
    const auth = useContext(AuthContext);

    const {
        isLoading,
        error,
        sendRequest,
        clearError
    } = useHttpClient();
    const navigate = useNavigate();

    const onBlogSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', formState?.inputs?.title?.value);
        formData.append('description', formState?.inputs?.description?.value);
        formData.append('image', formState?.inputs?.image?.value);
        formData.append('tags', JSON.stringify(tags));

        try {
            await sendRequest(
                process.env.REACT_APP_API_URL + 'post/create',
                "POST",
                formData,
                {
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
            <div className='main'>
                <div className='row'>
                    <div className='col-lg-8 mb-20'>
                        <div className='card pitch'>
                            <header className='auth-content'>
                                <h1>Add blog</h1>
                                <p></p>
                            </header>
                            <form>
                                <div className="file-container blog_file_container">
                                    <ImageUpload
                                        center
                                        id="image"
                                        onInput={inputHandler}
                                        errorText='Please provide an image.' />
                                </div>
                                <Input
                                    id="title"
                                    type="text"
                                    label="Title"
                                    errorText="Please enter a title"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    onInput={inputHandler}
                                />
                                <Input
                                    id="description"
                                    type="textarea"
                                    label="Description"
                                    rows="5"
                                    errorText="Please enter a description, at least 30 characters"
                                    validators={[VALIDATOR_MINLENGTH(30)]}
                                    onInput={inputHandler}
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
        </div>
    );
}

export default AddBlog;