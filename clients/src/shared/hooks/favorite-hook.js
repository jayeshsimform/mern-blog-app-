import { useContext } from 'react';
import { AuthContext } from '../context/auth-context'
import { useHttpClient } from './http-hook';

export const useFavorite = () => {
    const auth = useContext(AuthContext);

    const {
        sendRequest,
    } = useHttpClient();


    const toggleFavorite = async (blogId = '', isFavorite = false, cb = () => { }) => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_API_URL}post/user/favorite`,
                "PATCH",
                JSON.stringify({
                    postId: blogId,
                    isFavorite: isFavorite
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth?.user?.token
                }
            );
            await cb();

        }
        catch (err) {
            return err?.message;
        }

    }

    return {
        toggleFavorite,
    }
}


