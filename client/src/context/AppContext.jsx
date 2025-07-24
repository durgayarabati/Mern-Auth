
import { createContext, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = ( props ) => {

    const backendUrl= import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + "/api/user/data");
            data.sucess ? setUserData(data.user) : toast.error(data.message);

        }catch(error){
            toast.error(error.response.data.message);

        }}
    const getAuthState = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + "/api/auth/is-auth");
            if (data.sucess) {
                setIsLoggedIn(true);
                getUserData();
            }
            
        }catch(error){
            
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    };
    return (
    <AppContext.Provider value={{value}}>
        {props.children}
    </AppContext.Provider>);
};