'use client';

import React, { useState } from 'react';
import { Snippet } from "@nextui-org/snippet";
import { Button } from "@nextui-org/button";

const Page = () => {
  const [url, setUrl] = useState('');
  const [shorturl, setShorturl] = useState('');
  const [response, setResponse] = useState<{ message: string, shorturl?: string, error?: string }>({ message: '' });
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState<string>('');
  const [shorturlError, setShorturlError] = useState<string>('');

  // Function to check if a URL is valid
  const isValidUrl = (url: string) => {
    try {
      new URL(url); // This will throw if the URL is not valid
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setUrlError('');
    setShorturlError('');

    // Validation: Check if the URL is empty or invalid
    if (!url) {
      setUrlError('URL cannot be empty');
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    if (!shorturl) {
      setShorturlError('Short URL cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, shorturl }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setResponse({ message: 'URL created successfully!', shorturl: data.shorturl });
      } else if (res.status === 409) {
        setResponse({ message: 'Short URL already exists!', shorturl: data.shorturl });
      } else {
        setResponse({ message: 'Error: ' + data.message, error: data.error });
      }
    } catch (error) {
      setResponse({ message: 'Failed to create short URL', error: error.message });
    } finally {
      setUrl("");
      setShorturl("");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  text-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg ">
        <h2 className="text-3xl font-semibold mb-6 text-center">Create Short URL</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">Original URL</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border text-black border-gray-300 rounded-xl"
              placeholder="Enter your URL"
              required
            />
            {urlError && <p className="text-sm text-red-500">{urlError}</p>}
          </div>
          <div>
            <label htmlFor="shorturl" className="block text-sm font-medium text-gray-300 mb-2">Short URL</label>
            <input
              id="shorturl"
              type="text"
              value={shorturl}
              onChange={(e) => setShorturl(e.target.value)}
              required
              className="w-full text-black p-2 border rounded-xl border-gray-300"
              placeholder="Custom short URL"
            />
            {shorturlError && <p className="text-sm text-red-500">{shorturlError}</p>}
          </div>
          
          <Button onClick={handleSubmit} className='w-full bg-blue-900 rounded-xl hover:bg-blue-800' isLoading={loading}>
            Shorten
          </Button>

        </form>

        {response.message && (
          <div className="mt-6">
            <p className={`text-sm ${response.error ? 'text-red-500' : 'text-green-500'}`}>{response.message}</p>
            {response.shorturl && (
              <div className="mt-4">
                <p>Short URL:</p>
                <Snippet symbol="" className='bg-blue-500/40 w-full rounded-2xl my-4 px-3 py-1' color='primary'>
                  {process.env.NEXT_PUBLIC_HOST + "/" + response.shorturl}
                </Snippet>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
