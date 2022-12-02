import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useHttpClient } from '../../shared/hooks/';
import { PASSWORD_COMPARE, validate, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import Input from '../../shared/component/input/input';
import ImageUpload from '../../shared/component/ImageUpload/ImageUpload';
import Button from '../../shared/component/Button/Button';
import Snackbar from '../../shared/component/Snackbar/Snackbar';
import Loader from '../../shared/component/Loader/Loader';


const Signup = () => {
    const [formState, inputHandler] = useForm(
        {
            name: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            email: {
                value: '',
                isValid: false
            },
            mobile: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            },
            'cnf-password': {
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

    const {
        isLoading,
        error,
        sendRequest,
        clearError
    } = useHttpClient();
    const navigate = useNavigate()

    const authSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', formState?.inputs?.name?.value);
        formData.append('description', formState?.inputs?.description?.value);
        formData.append('email', formState?.inputs?.email?.value);
        formData.append('mobile', formState?.inputs?.mobile?.value);
        formData.append('password', formState?.inputs?.password?.value);
        formData.append('image', formState?.inputs?.image?.value);

        try {
            await sendRequest(
                process.env.REACT_APP_API_URL + 'auth/signup',
                "POST",
                formData
            )
            navigate('/login')
        }
        catch (err) { }
    }


    return (
        <>
            {error && <Snackbar type='error' error={error} clearError={clearError} />}
            <div className='auth-wrapper'>
                <div className='auth-box'>
                    {
                        isLoading && <Loader asOverlay />
                    }
                    <div className='card pitch'>
                        <header className='auth-content'>
                            <h1>Sign up with email</h1>
                            <p>Enter your email address to create an account.</p>
                        </header>
                        <form onSubmit={authSubmitHandler}>

                            <div className="file-container">
                                <ImageUpload
                                    center
                                    id="image"
                                    onInput={inputHandler}
                                    errorText='Please provide an image.' />
                            </div>

                            <Input
                                id="name"
                                type="text"
                                label="Your Name"
                                errorText="Please enter a valid name"
                                validators={[VALIDATOR_REQUIRE()]}
                                onInput={inputHandler}
                            />
                            <Input
                                id="description"
                                type="textarea"
                                rows="4"
                                label="Your description"
                                errorText="Please enter a description, at least 30 characters"
                                validators={[VALIDATOR_MINLENGTH(30)]}
                                onInput={inputHandler}
                            />
                            <Input
                                id="email"
                                type="email"
                                label="E-mail"
                                errorText="Please enter a valid email address"
                                validators={[VALIDATOR_EMAIL()]}
                                onInput={inputHandler}
                            />

                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                errorText="Please enter a valid password, at least 5 characters"
                                validators={[VALIDATOR_MINLENGTH(6)]}
                                onInput={inputHandler}
                            />
                            <Input
                                id="cnf-password"
                                type="password"
                                label="Confirm Password"
                                validators={[PASSWORD_COMPARE(formState?.inputs?.password)]}
                                errorText="Please enter a valid password, at least 5 characters"
                                onInput={inputHandler}
                            />
                            <Input
                                id="mobile"
                                type="text"
                                label="Mobile"
                                errorText="Please enter a valid Mobile, at least 10 characters"
                                validators={[VALIDATOR_MINLENGTH(10)]}
                                onInput={inputHandler}
                            />
                            <div className="input-container center">
                                <Button type="submit" disabled={!formState.isValid}>
                                    Signup
                                </Button>
                            </div>
                        </form>
                        <h4>
                            Already have an account? <Link to="/login">Login</Link>
                        </h4>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;