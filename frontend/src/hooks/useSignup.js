import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/user/signup",
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // save the user to local storage
            localStorage.setItem("user", JSON.stringify(response.data));

            // update the auth context
            dispatch({ type: "LOGIN", payload: response.data });

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.error);
            throw new Error(error.response.data.error);
        }
    };

    return { signup, isLoading, error };
};
