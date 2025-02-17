"use client"

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SignIn() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    // Get callbackUrl from query params and set it
    const urlCallback = searchParams.get("callbackUrl");
    if (urlCallback) {
      setCallbackUrl(urlCallback);
    }
  }, [searchParams]);

  const handleSignIn = async () => {
    try {
      // console.log("username", username)
      const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Response:', data);

      if (data.id) {
        // Save user session
        localStorage.setItem('user', JSON.stringify(data));
        // Redirect after login
        // console.log("callbackUrl", callbackUrl)
        router.push(callbackUrl);
      } else {
        alert("Login failed. Please try again.");
      }

    } catch (error) {
      console.error('Error:', error);
      alert("Error: Unable to sign in. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse h-screen bg-[--green500]">
      {/* Section A - Moves to Right on Desktop */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[--green300] p-6 flex flex-col items-center justify-center rounded-3xl">
        {/* <h1 className="text-white text-xl">Section A</h1> */}
        <div className="md:mt-24">
          <Image
            src="/board-image.png"
            alt="Board Illustration"
            width={200}
            height={200}
          />
        </div>
        <div className="text-white text-xl italic mt-6">
          a Board
        </div>

      </div>

      {/* Section B - Moves to Left on Desktop */}
      <div className="w-full md:h-full h-1/2 md:w-1/2  bg-[--green500] p-6 flex flex-col justify-center">
        {/* <h1 className="text-white text-xl">Section B</h1> */}
        <h2 className="text-2xl text-white mb-6 text-start">Sign in</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          onClick={handleSignIn}
          className="w-full p-3 mt-4 bg-green-600 rounded-md text-white hover:bg-green-700 transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );


}
