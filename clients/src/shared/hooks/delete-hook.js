import { useContext, useState } from 'react';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from './';
export const useDeletePost = (cb, setError) => {
    const [showConfirmModal, setIsDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const auth = useContext(AuthContext);

    let {
        isLoading,
        sendRequest,
        clearError
    } = useHttpClient();

    const onDeletePlaceHandler = async () => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_API_URL}post/${deleteId}`,
                "DELETE",
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth?.user?.token
                }
            );
            cb();
            setIsDeleteConfirm(!showConfirmModal);
            setError()
        }
        catch (err) {
            setError(err.message)
        }
    }


    const onConfirmModalHandler = (id) => {
        setDeleteId(id)
        setIsDeleteConfirm(!showConfirmModal)
    }
    return {
        onDeletePlaceHandler,
        isLoading,
        showConfirmModal,
        onConfirmModalHandler
    }
}