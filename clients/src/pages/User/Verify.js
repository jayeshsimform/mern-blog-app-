import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../shared/component/Loader/Loader';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Verify = () => {
    const [validUrl, setValidUrl] = useState(true);
    const {
        isLoading,
        sendRequest,
        error,
    } = useHttpClient();

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await sendRequest(
                    `${process.env.REACT_APP_API_URL}/user/${params?.id}/verify/${params?.token}`,
                    "GET",
                    null,
                    {
                        'Content-Type': 'application/json',
                    }
                );
                setValidUrl(true);
                navigate('/login')
            }
            catch (err) {
                setValidUrl(false);
                console.log("err", err)
            }
        }
        verifyToken()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            {isLoading && <Loader asOverlay />}

            <div className='auth-wrapper'>
                <div className='auth-box'>
                    <div className='card center'>
                        {
                            validUrl ?
                                <>
                                    <div className='border-check'>
                                        <i className="checkmark">✓</i>
                                    </div>
                                    <h1>Success</h1>
                                    <p>Your account verify successfully, Please <Link to="/login">login</Link> </p>
                                </>
                                : <h1>{error}</h1>
                        }

                    </div>
                </div>
            </div>
        </div>

    );
}

export default Verify;