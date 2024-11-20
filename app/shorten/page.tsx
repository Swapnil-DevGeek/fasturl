'use client';
import React, { useState } from 'react';
import { Snippet } from "@nextui-org/snippet";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import Link from 'next/link';
import { generateRandomSlug } from '@/lib/generateSlug';

const Page = () => {
  const [url, setUrl] = useState('');
  const [shorturl, setShorturl] = useState('');
  const [useCustomSlug, setUseCustomSlug] = useState(true);
  const [response, setResponse] = useState<{ message: string, shorturl?: string, error?: string }>({ message: '' });
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState<string>('');
  const [shorturlError, setShorturlError] = useState<string>('');

  // Rest of the state and handlers remain the same...
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');
    setShorturlError('');

    if (!url) {
      setUrlError('URL cannot be empty');
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    if (useCustomSlug && !shorturl) {
      setShorturlError('Short URL cannot be empty when using custom slug');
      return;
    }

    setLoading(true);
    try {
      const slugToUse = useCustomSlug ? shorturl : generateRandomSlug();
      
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          shorturl: slugToUse,
          generateRandom: !useCustomSlug 
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setResponse({ message: 'URL created successfully!', shorturl: data.shorturl });
      } else if (res.status === 409) {
        // If using random slug and got a conflict, automatically retry
        if (!useCustomSlug) {
          const newSlug = generateRandomSlug();
          const retryRes = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url, 
              shorturl: newSlug,
              generateRandom: true 
            }),
          });
          const retryData = await retryRes.json();
          if (retryRes.status === 201) {
            setResponse({ message: 'URL created successfully!', shorturl: retryData.shorturl });
          } else {
            setResponse({ message: 'Error: Failed to generate unique slug', error: retryData.error });
          }
        } else {
          setResponse({ message: 'Short URL already exists!', error: 'Please choose a different short URL' });
        }
      } else {
        setResponse({ message: 'Error: ' + data.message, error: data.error });
      }
    } catch (error) {//@ts-ignore
      setResponse({ message: 'Failed to create short URL', error: error.message });
    } finally {
      setUrl('');
      setShorturl('');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-8 rounded-2xl ">
  
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="p-4 rounded-full bg-blue-500/20 border border-blue-500/30">
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Create Short URL
            </h2>
          </div>
        </div>

        

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              Original URL
            </label>
            <div className="relative">
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-3 border bg-gray-800/50 text-white border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your URL"
                required
              />
              {url && (
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              )}
            </div>
            {urlError && <p className="text-sm text-red-400">{urlError}</p>}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <label htmlFor="useCustomSlug" className="text-sm font-medium text-gray-300">
              Generate Random Short Url
            </label>
            <Switch
              id="useCustomSlug"
              checked={!useCustomSlug}
              onChange={() => setUseCustomSlug(!useCustomSlug)}
              className="data-[selected=true]:bg-blue-500"
              classNames={{
                wrapper: "border-2 border-gray-600 group-data-[selected=true]:border-blue-500",
                thumb: "group-data-[selected=true]:bg-white"
              }}
            />
          </div>

          {useCustomSlug && (
            <div className="space-y-2">
              <label htmlFor="shorturl" className="block text-sm font-medium text-gray-300 mb-2">
                Custom Short URL
              </label>
              <div className="relative">
                <input
                  id="shorturl"
                  type="text"
                  value={shorturl}
                  onChange={(e) => setShorturl(e.target.value)}
                  className="w-full p-3 border bg-gray-800/50 text-white border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="Enter custom slug"
                />
              </div>
              {shorturlError && <p className="text-sm text-red-400">{shorturlError}</p>}
            </div>
          )}

          <Button
            isLoading={loading}
            disabled={loading}
            spinner={
              <svg
                className="animate-spin h-5 w-5 text-current"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
            }
            onClick={handleSubmit}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>
        </form>

        {response.message && (
          <div className="mt-6 space-y-4">
            <p className={`text-sm ${response.error ? 'text-red-400' : 'text-green-400'}`}>
              {response.message}
            </p>
            {response.shorturl && (
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">Your shortened URL:</p>
                <Snippet
                  symbol=""
                  className="bg-gray-800/70 border border-gray-700 w-full rounded-xl my-4 px-3 py-3"
                  classNames={{
                    base: "bg-gray-800/70 border border-gray-700",
                    copy: "text-gray-400 hover:text-white",
                    pre: "text-gray-300"
                  }}
                >
                  <Link
                    className="hover:text-blue-400 transition-all duration-75"
                    href={`https://fasturl.in/${response.shorturl}`}
                    target="_blank"
                  >
                    {`https://fasturl.in/${response.shorturl}`}
                  </Link>
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