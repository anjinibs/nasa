// components/AddResearchModal.js
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddResearchModal = ({ show, onClose,publicationlength }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [titleError, setTitleError] = useState('');
  const [linkError, setLinkError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    let valid = true;
    if (!title.trim()) {
      setTitleError('Research title is required.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!link.trim()) {
      setLinkError('Research link is required.');
      valid = false;
    } else if (!/^https?:\/\/.+/.test(link)) {
      setLinkError('Please enter a valid URL.');
      valid = false;
    } else {
      setLinkError('');
    }

    if (valid) {
      setLoading(true);
      setError('');
    const toastId = toast.loading('Adding.....',{theme: "dark"});
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
link: link,
title: title
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/research", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        toast.dismiss(toastId);

        if (result.error === "false") {
          publicationlength()
          setLoading(false)
          onClose()
          toast.success('Added successfully!',{theme: "dark"});
        } else {
          setLoading(false)
          toast.error(result.message || "failed", {theme: "dark"});
        }
      })
      .catch((error) => console.error(error));
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-bold text-white mb-6 text-center">ADD RESEARCH</h3>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              RESEARCH TITLE
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-gray-700 border ${titleError ? 'border-red-500' : 'border-gray-600'} text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-2">
              RESEARCH LINK
            </label>
            <input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={`w-full bg-gray-700 border ${linkError ? 'border-red-500' : 'border-gray-600'} text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {linkError && <p className="text-red-500 text-xs mt-1">{linkError}</p>}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-8 transition-colors disabled:bg-gray-500"
        >
          {loading ? 'Adding...' : 'Add Research'}
        </button>
      </div>
    </div>
  );
};

export default AddResearchModal;
