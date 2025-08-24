'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/auth';

export default function TestDBPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Basic connection
      console.log('Testing basic connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      results.connection = {
        success: !connectionError,
        error: connectionError?.message,
        data: connectionTest
      };

      // Test 2: Check if users table exists
      console.log('Testing users table access...');
      const { data: usersTest, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);
      
      results.usersTable = {
        success: !usersError,
        error: usersError?.message,
        data: usersTest,
        count: usersTest?.length || 0
      };

      // Test 3: Check if service_providers table exists
      console.log('Testing service_providers table access...');
      const { data: providersTest, error: providersError } = await supabase
        .from('service_providers')
        .select('*')
        .limit(5);
      
      results.providersTable = {
        success: !providersError,
        error: providersError?.message,
        data: providersTest,
        count: providersTest?.length || 0
      };

      // Test 4: Check current user session
      console.log('Testing user session...');
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      
      results.userSession = {
        success: !sessionError,
        error: sessionError?.message,
        user: user ? {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at
        } : null
      };

      // Test 5: Check RLS policies
      if (user) {
        console.log('Testing RLS policies...');
        const { data: rlsTest, error: rlsError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        results.rlsPolicies = {
          success: !rlsError,
          error: rlsError?.message,
          canAccessOwnProfile: !rlsError,
          data: rlsTest
        };
      }

    } catch (error) {
      console.error('Test error:', error);
      results.generalError = error;
    }

    setTestResults(results);
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults({});
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Connection Test</h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="px-4 py-2 bg-[#E76F51] text-white rounded-lg hover:bg-[#D65A42] disabled:opacity-50 mr-4"
            >
              {loading ? 'Running Tests...' : 'Run Tests'}
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>

          <div className="space-y-6">
            {/* Connection Test */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">1. Basic Connection Test</h3>
              {testResults.connection ? (
                <div className={`p-3 rounded ${testResults.connection.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-medium ${testResults.connection.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResults.connection.success ? '✅ Connection Successful' : '❌ Connection Failed'}
                  </p>
                  {testResults.connection.error && (
                    <p className="text-red-600 text-sm mt-1">{testResults.connection.error}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Test not run yet</p>
              )}
            </div>

            {/* Users Table Test */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">2. Users Table Access</h3>
              {testResults.usersTable ? (
                <div className={`p-3 rounded ${testResults.usersTable.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-medium ${testResults.usersTable.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResults.usersTable.success ? '✅ Users Table Accessible' : '❌ Users Table Not Accessible'}
                  </p>
                  <p className="text-sm mt-1">Records found: {testResults.usersTable.count}</p>
                  {testResults.usersTable.error && (
                    <p className="text-red-600 text-sm mt-1">{testResults.usersTable.error}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Test not run yet</p>
              )}
            </div>

            {/* Service Providers Table Test */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">3. Service Providers Table Access</h3>
              {testResults.providersTable ? (
                <div className={`p-3 rounded ${testResults.providersTable.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-medium ${testResults.providersTable.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResults.providersTable.success ? '✅ Service Providers Table Accessible' : '❌ Service Providers Table Not Accessible'}
                  </p>
                  <p className="text-sm mt-1">Records found: {testResults.providersTable.count}</p>
                  {testResults.providersTable.error && (
                    <p className="text-red-600 text-sm mt-1">{testResults.providersTable.error}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Test not run yet</p>
              )}
            </div>

            {/* User Session Test */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">4. User Session Test</h3>
              {testResults.userSession ? (
                <div className={`p-3 rounded ${testResults.userSession.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-medium ${testResults.userSession.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResults.userSession.success ? '✅ Session Check Successful' : '❌ Session Check Failed'}
                  </p>
                  {testResults.userSession.user ? (
                    <div className="mt-2 text-sm">
                      <p><strong>User ID:</strong> {testResults.userSession.user.id}</p>
                      <p><strong>Email:</strong> {testResults.userSession.user.email}</p>
                      <p><strong>Email Verified:</strong> {testResults.userSession.user.email_confirmed_at ? 'Yes' : 'No'}</p>
                    </div>
                  ) : (
                    <p className="text-sm mt-1">No user logged in</p>
                  )}
                  {testResults.userSession.error && (
                    <p className="text-red-600 text-sm mt-1">{testResults.userSession.error}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Test not run yet</p>
              )}
            </div>

            {/* RLS Policies Test */}
            {testResults.userSession?.user && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">5. RLS Policies Test</h3>
                {testResults.rlsPolicies ? (
                  <div className={`p-3 rounded ${testResults.rlsPolicies.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`font-medium ${testResults.rlsPolicies.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResults.rlsPolicies.success ? '✅ RLS Policies Working' : '❌ RLS Policies Issue'}
                    </p>
                    <p className="text-sm mt-1">Can access own profile: {testResults.rlsPolicies.canAccessOwnProfile ? 'Yes' : 'No'}</p>
                    {testResults.rlsPolicies.error && (
                      <p className="text-red-600 text-sm mt-1">{testResults.rlsPolicies.error}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Test not run yet</p>
                )}
              </div>
            )}

            {/* General Error */}
            {testResults.generalError && (
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h3 className="text-lg font-semibold text-red-800 mb-2">General Error</h3>
                <p className="text-red-600">{String(testResults.generalError)}</p>
              </div>
            )}
          </div>

          {/* Debug Information */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Debug Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
