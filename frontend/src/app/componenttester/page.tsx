'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';

// Define the props for the LoginModal component
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A reusable, accessible pop-up modal component for a login form.
 * It features a backdrop with a blur effect and smooth transitions.
 */
function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // Effect to handle closing the modal with the 'Escape' key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    // Fragment is used to return multiple elements without a wrapper div in the final DOM
    <Fragment>
      {/* 1. The Modal Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose} // Close modal on backdrop click
        aria-hidden="true"
      ></div>

      {/* 2. The Modal Panel */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 id="login-modal-title" className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 transition hover:text-gray-600"
              aria-label="Close login modal"
            >
              <i className="fas fa-times h-6 w-6"></i>
            </button>
          </div>
          <p className="mt-2 text-gray-600">Please sign in to continue.</p>

          {/* Login Form */}
          <form className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
               <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
              <input
                type="password"
                id="password"
                className="w-full rounded-md border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="••••••••"
              />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </Fragment>
  );
}

/**
 * This is an example page component demonstrating how to use the LoginModal.
 * It manages the modal's state and provides a button to open it.
 */
export default function LoginPageExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Our Site</h1>
        <p className="mt-4 text-lg text-gray-700">Click the button below to open the login form.</p>
        <button
          onClick={openModal}
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          Open Login Modal
        </button>
      </div>

      {/* Render the LoginModal and pass state and handlers as props */}
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
}
