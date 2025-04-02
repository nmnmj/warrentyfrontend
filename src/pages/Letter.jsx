import React, { useState, useEffect } from 'react';
import ReactQuillNew from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import useStore from '../utility/UseStore';
import { showToast } from '../utility/Toast';
import { FcDisclaimer } from "react-icons/fc";
import { FaGoogleDrive } from "react-icons/fa";

// Google Client ID (Replace with your actual client ID)
const CLIENT_ID = `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`;

const LetterC  = () => {
  const [editorContent, setEditorContent] = useState(
    localStorage.getItem('letterContent')
      ?.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "\t") // Replace 4 non-breaking spaces with tab
      ?.replace(/&nbsp;/g, " ") // Replace non-breaking spaces with regular spaces
      ?.replace(/<br>/g, "\n")
      || ''
  );

  const { text, setText } = useStore();
  const [title, setTitle] = useState(localStorage.getItem('letterTitle') || '');
  const [authCode, setAuthCode] = useState(null);
  const [loading, setLoading] = useState(false)

  const login = useGoogleLogin({
    flow: 'implicit',
    scope: 'https://www.googleapis.com/auth/drive.file',
    onSuccess: async (codeResponse) => {
      const contentToSave = localStorage.getItem("letterContent");
      const titleToSave = localStorage.getItem("letterTitle")
      setText(codeResponse.access_token);
      if(contentToSave == '' || titleToSave == '' || contentToSave.length == 0 || titleToSave.length == 0){
        showToast('info', 'Please fill in the content and title before saving');
        return false;
      }
      setAuthCode(codeResponse.access_token);
      showToast('info', 'Successfully Logged In. Now Saving to Drive ...');
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/save-to-drive`, {
          authCode: codeResponse.access_token,
          html: contentToSave,
          title: titleToSave,
        });
        if(response.data.id){
          handleClear()
          showToast('success', 'Successfully Saved File');
        }
      } catch (error) {
        console.error(error);
        showToast('error', 'Try Again');
      } finally {
        setAuthCode(null);
      }
    },
    onError: (errorResponse) => {
      console.error('Login Failed:', errorResponse);
      showToast('error', 'Something went wrong. Try Again');
    }
  });

  const directSaveToDrive = async () => {
    const contentToSave = localStorage.getItem("letterContent");
    const titleToSave = localStorage.getItem("letterTitle");
    if(contentToSave == '' || titleToSave == '' || contentToSave.length == 0 || titleToSave.length == 0){
      showToast('info', 'Please fill in the content and title before saving');
      return false;
    }
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/save-to-drive`, {
        authCode: text,
        html: contentToSave,
        title: titleToSave,
      });
      if(response.data.id){
        handleClear()
        showToast('success', 'Successfully Saved File');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Try Again');
    } finally {
      setLoading(false)
      setAuthCode(null);
    }
  }

  useEffect(() => {
    // Check if there is saved content in localStorage
    const savedContent = localStorage.getItem('letterContent') || '';
    if (savedContent) {
      setEditorContent(savedContent);
    }
  }, []);

  // Save title separately when it changes
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    localStorage.setItem('letterTitle', newTitle);
  };

  const handleSave = () => {
    // Save content to localStorage with formatting preserved
    const preservedContent = editorContent
      .replace(/\n/g, "<br>") // preserve new lines
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // replace tab with 4 non-breaking spaces
      .replace(/ /g, '&nbsp;');
    localStorage.setItem('letterContent', preservedContent);
    console.log('Saved content:', preservedContent);
  };

  const handleClear = () => {
    // Clear content from localStorage and reset the editor
    setEditorContent('');
    setTitle('')
    setTimeout(() => {
      localStorage.removeItem('letterContent');
      localStorage.removeItem('letterTitle');
    }, 0);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background'
  ];

  return (
    <div className="mt-5 max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
      
      <input
        type="text"
        placeholder="Enter title here..."
        value={title}
        onChange={handleTitleChange}
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
      <ReactQuillNew
        theme="snow"
        formats={formats}
        modules={modules}
        value={editorContent}
        onChange={(newValue) => {
          setEditorContent(newValue);
          handleSave(newValue);
        }}
        className="h-[300px] border border-gray-300 rounded-lg transition-all duration-300 focus:border-blue-500"
      />
      <div className="mt-10 flex flex-wrap gap-4">
        {!authCode ? (
          <>
          {
            !text ?
            <button 
              onClick={login} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 items-center"
            >
              <FaGoogleDrive className="mr-2" />
              Save to Drive with Google Sign-In
            </button>
            :
            <button 
              onClick={directSaveToDrive} 
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 items-center"
            >
              <FaGoogleDrive className="mr-2" />
              Save to Drive {loading && ".................."}
            </button>
            
          }
          
          </>
        ) : (
          <button 
            disabled={true} 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md opacity-70 cursor-not-allowed"
          >
            Loading...
          </button>
        )}
        <button
          onClick={handleClear}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Clear
        </button>
        <p className="mb-2 text-gray-500 text-sm">
        <FcDisclaimer className="text-xl mr-1" />
        Changes are automatically saved. You can directly save to Google Drive with one click.
        </p>
      </div>
    </div>
  );
};

const Letter = () => (
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <LetterC />
  </GoogleOAuthProvider>
);

export default Letter;
