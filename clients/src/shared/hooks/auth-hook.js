import { useState, useCallback, useEffect } from 'react';
let logoutTimer;


export const useAuth = () => {
    let [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [user, setUser] = useState();
    const login = useCallback((responseData) => {
        setUser(responseData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        tokenExpirationDate = responseData?.expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);

        localStorage.setItem(
            'userData',
            JSON.stringify({
                ...responseData,
                expiration: new Date(tokenExpirationDate).toISOString()
            })
        );
    }, []);

    const logout = useCallback(() => {

        setTokenExpirationDate(null);
        setUser(null)
        localStorage.removeItem('userData');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (user?.token && tokenExpirationDate) {
            const remainingTime = new Date(tokenExpirationDate).getTime() - new Date().getTime();

            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [user?.token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData?.token &&
            new Date(storedData?.expiration) > new Date()
        ) {
            login(storedData);
        }
    }, [login]);

    // useEffect(() => {
    //     const storageData = JSON.parse(localStorage.getItem('userData'));
    //     if (
    //         storageData?.user?.token &&
    //         new Date(storageData?.user?.expiration) > new Date()
    //     ) {
    //         const user = {
    //             ...storageData?.user,
    //             expiration: storageData?.user?.expiration
    //         }
    //         login(user)
    //     }
    // }, [login])

    return {
        login,
        logout,
        user
    }
}