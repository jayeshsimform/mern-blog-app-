import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/component/Button/Button';
import Input from '../../shared/component/input/input';
import Loader from '../../shared/component/Loader/Loader';
import Snackbar from '../../shared/component/Snackbar/Snackbar';
import { useForm, useHttpClient } from '../../shared/hooks';
import { VALIDATOR_MINLENGTH } from '../../shared/utils/validators';


const ForgotPassword = () => {
    const params = useParams();
    const [formState, inputHandler] = useForm(
        {
            password: {
                value: '',
                isValid: false
            },

            're-password': {
                value: '',
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

    const navigate = useNavigate();

    console.log("params:::", params);

    const authSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', formState?.inputs?.email?.value);
        formData.append('password', formState?.inputs?.password?.value);

        try {
            await sendRequest(
                process.env.REACT_APP_API_URL + 'user/update-password',
                "POST",
                JSON.stringify({
                    password: formState?.inputs?.password?.value,
                    token: params?.token,
                    userId: params?.id
                }),
                {
                    'Content-Type': 'application/json'
                }
            )

            navigate('/')

        }
        catch (err) { }
    }


    return (
        <div>
            {error && <Snackbar type='error' error={error} clearError={clearError} />}
            {
                isLoading && <Loader asOverlay />
            }
            <div className='auth-wrapper'>
                <div className='auth-box'>

                    <div className='card pitch'>
                        <header className='auth-content'>
                            <h1>Enter your new password</h1>
                        </header>
                        <form onSubmit={authSubmitHandler}>
                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                errorText="Please enter a valid password, at least 6 characters"
                                validators={[VALIDATOR_MINLENGTH(6)]}
                                onInput={inputHandler}
                            />

                            <Input
                                id="re-password"
                                type="password"
                                label="Re-Password"
                                errorText="Please enter a valid password, at least 6 characters"
                                validators={[VALIDATOR_MINLENGTH(6)]}
                                onInput={inputHandler}
                            />
                            <div className="input-container center">
                                <Button type="submit" disabled={!formState.isValid}>
                                    Update
                                </Button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ForgotPassword;