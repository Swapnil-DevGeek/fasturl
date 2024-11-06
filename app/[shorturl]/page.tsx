'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const RedirectPage = () => {
    const [redirecting, setRedirecting] = useState(true);
    const shorturl = usePathname();

  useEffect(() => {
    if (!shorturl) {
      setRedirecting(false);
      alert('Short URL is missing!');
      return;
    }

    const fetchUrl = async () => {
      try {
        const res = await fetch(`/api/redirect${shorturl}`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shorturl }),
        });
        const data = await res.json();
        
        if (res.status === 200 && data.url) {
            window.location.href = data.url;
        } else {
            alert(data.message || 'Something went wrong');
        }
      } catch (error) {
        console.log(error)
        alert('Failed to redirect');
      } finally {
        setRedirecting(false);
      }
    };

    fetchUrl();
  }, [shorturl]);

  if (redirecting) {
    return <div className="mt-20">Redirecting...</div>;
  }

  return null; 
};

export default RedirectPage;
