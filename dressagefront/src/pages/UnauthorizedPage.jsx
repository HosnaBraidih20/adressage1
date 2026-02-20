import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Unauthorized Page Component
 * Displayed when user tries to access a resource they don't have permission for
 */
const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-red-600 mb-4">403</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this resource. Please check your account role or contact an administrator.
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200 mb-8">
          <p className="text-sm text-red-700">
            <strong>Why am I seeing this?</strong>
            <br />
            This page requires special permissions that your account doesn't have.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/register"
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
