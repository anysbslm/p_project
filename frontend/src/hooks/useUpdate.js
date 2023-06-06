import { useState } from 'react';

export const useUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const updatePassword = async (email, currentPassword, newPassword) => {
    setIsLoading(true);
    setError('');

    try {
      // Make the API request to update the password
      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        }),
      });

      if (!response.ok) {
        // Handle the error response
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const result = await response.json();
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      throw error;
    }
  };

  return { updatePassword, isLoading, error };
};

