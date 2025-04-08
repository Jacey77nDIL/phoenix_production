'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WaitlistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '' });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      email: formData.email,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/add_to_waitlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Success:', result.message);
        router.push('/waitlist-success');
      } else {
        console.log('Error submitting form:', result);
      }
    } catch (error) {
      console.error('Network/server error:', error);
    }
  };


  return (
    <main className="min-h-screen bg-gradient-to-r from-green-200 to-white flex items-center justify-center relative px-4">
      {/* Logo */}
      <div className="absolute top-4 left-4 p-2 bg-white rounded-full">
        <Image src="/p2.svg" alt="Logo" width={100} height={100} />
      </div>

      {/* Form Box */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          We just need some information about you
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 py-3 px-4 rounded-xl focus:outline-none focus:border-green-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 py-3 px-4 rounded-xl focus:outline-none focus:border-green-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#5e852c] text-white py-3 px-10 rounded-xl font-semibold hover:bg-green-800"
          >
            Join Our Waitlist
          </button>
        </form>
      </div>
    </main>
  );
}
