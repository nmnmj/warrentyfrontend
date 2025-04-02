import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useStore from '../utility/UseStore';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { showToast } from '../utility/Toast';
import { FaGoogleDrive } from 'react-icons/fa';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SavedLetterC = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { text, setText } = useStore();

  const login = useGoogleLogin({
    flow: 'implicit',
    scope: 'https://www.googleapis.com/auth/drive.file',
    onSuccess: (codeResponse) => {
      setText(codeResponse.access_token);
      showToast('success', 'Successfully Logged In');
    },
    onError: (errorResponse) => {
      console.error('Login Failed:', errorResponse);
      showToast('info', 'Try Again');
    },
  });

  const fetchLetters = useCallback(async () => {
    if (!text) return;
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-letters`, {
        params: { authCode: text },
      });
      if (response.data.files) {
        showToast('success', 'Retrieved Files');
      }
      setLetters(response.data.files || []);
    } catch (err) {
      console.error(err);
      showToast('error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [text]);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  return (
    <>
      {!text ? (
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          <FaGoogleDrive className="mr-2" />
          Sign in with Google to view saved files
        </button>
      ) : (
        <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded shadow-md mt-10">
          <h2 className="text-lg font-bold mb-4">Saved Letters</h2>
          {loading ? (
            <p className="text-blue-500">Loading...</p>
          ) : (
            <ul className="space-y-2">
               {letters.length > 0 ? (
                letters.map((letter) => (
                  <li key={letter.id} className="p-2 bg-white rounded shadow-sm">
                    <a
                      href={letter.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {letter.name}
                    </a>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(letter.createdTime).toLocaleString()}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No saved letters found.</p>
              )}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

const SavedLetter = () => (
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <SavedLetterC />
  </GoogleOAuthProvider>
);

export default SavedLetter;
