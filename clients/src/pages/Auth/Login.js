import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useHttpClient } from '../../shared/hooks/';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/utils/validators';
import { AuthContext } from '../../shared/context/auth-context';

import Input from '../../shared/component/input/input';
import Button from '../../shared/component/Button/Button';
import Snackbar from '../../shared/component/Snackbar/Snackbar';
import Loader from '../../shared/component/Loader/Loader';
import Modal from '../../shared/component/Modal/Modal';


const Login = () => {
    const [formState, inputHandler] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },

            password: {
                value: '',
                isValid: false
            },
        },
        false
    );
    const [isForgot, setIsForgot] = useState(false)

    const {
        isLoading,
        error,
        sendRequest,
        clearError
    } = useHttpClient();

    const navigate = useNavigate();

    const auth = useContext(AuthContext);

    const authSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', formState?.inputs?.email?.value);
        formData.append('password', formState?.inputs?.password?.value);

        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_API_URL + 'auth/login',
                "POST",
                JSON.stringify({
                    email: formState?.inputs?.email?.value,
                    password: formState?.inputs?.password?.value
                }),
                {
                    'Content-Type': 'application/json'
                }
            )
            auth.login(responseData);
            navigate('/')

        }
        catch (err) { }
    }

    const handleForgot = () => {
        setIsForgot(!isForgot)
    }

    const forgotPassword = async () => {
        try {
            await sendRequest(
                process.env.REACT_APP_API_URL + 'auth/forgot-password',
                "POST",
                JSON.stringify({
                    email: formState?.inputs?.email?.value,
                }),
                {
                    'Content-Type': 'application/json'
                }
            )
            await handleForgot();

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
                            <h1>Login with email</h1>
                            <p>Enter the email address associated with your account</p>
                        </header>
                        <form onSubmit={authSubmitHandler}>
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
                            <h6 className='link-pass' onClick={handleForgot}>
                                Forgot password
                            </h6>
                            <div className="input-container center">
                                <Button type="submit" disabled={!formState.isValid}>
                                    Login
                                </Button>
                            </div>
                        </form>
                        <h4>
                            No account? <Link to="/signup">Create one</Link>
                        </h4>
                    </div>
                </div>
                <Modal
                    show={isForgot}
                    header="Forgot password"
                    footerClass="place-item__modal-actions"
                    footer={<>
                        <Button disabled={isLoading} inverse onClick={handleForgot}>Cancel</Button>
                        <Button danger onClick={forgotPassword}>Send</Button>
                    </>}>
                    <div className='forgot-wrap'>
                        <Input
                            id="email"
                            type="email"
                            label="Enter your registered email"
                            errorText="Please enter a valid email address"
                            validators={[VALIDATOR_EMAIL()]}
                            onInput={inputHandler}
                        />
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default Login;