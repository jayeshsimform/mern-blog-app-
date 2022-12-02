import axios from "axios";
import { useCallback, useState, useContext } from "react"
import { AuthContext } from "../context/auth-context";
let responseData;
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState();
    const auth = useContext(AuthContext);


    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true);
            const config = {
                url: url,
                method: method,
                data: body,
                headers: headers
            }

            method === 'DELETE' && await delete config.data;

            await axios(config).then(res => {
                setIsLoading(false)
                responseData = res.data;
            }).catch(async err => {
                setIsLoading(false)
                if (err.response.status === 401) {
                    responseData = await validateToken(config);
                }
                else {
                    setError(err.response.data.message || err.message);
                    throw new Error(err.response.data.message || err.message)
                }
            })
            return responseData;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])


    const validateToken = async (config) => {
        try {
            const data = await sendRequest(process.env.REACT_APP_API_URL + 'token/refresh', "POST", { refreshToken: auth?.user?.refreshToken });
            config.headers.Authorization = 'Bearer ' + data?.token;
            auth.login({
                ...data,
                expiration: auth?.user?.expiration
            })

            let response;
            await axios(config)
                .then(res => {
                    response = res.data;
                }).catch(err => {
                    console.log("err", err)
                })

            return response;
        }
        catch (err) {
            throw new Error(err)
        }

    }
    const clearError = () => {
        setError(null)
    }

    return {
        isLoading,
        error,
        sendRequest,
        clearError,
        setError

    }
}