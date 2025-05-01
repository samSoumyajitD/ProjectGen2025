'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@heroui/react';
import StudentNavbar from '@/components/StudentComponents/StudentNavbar';

interface Goal {
  _id: string;
  goal: string;
}

interface CertificateStatus {
  goalId: string;
  eligible: boolean;
  verdict: string;
}

const CertificationsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [certificateStatuses, setCertificateStatuses] = useState<Record<string, CertificateStatus>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGoals = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/goals/getGoalsByUserId", { withCredentials: true });
      setGoals(response.data.goals);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals.');
    }
  };

  const checkCertificateEligibility = async (goalId: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/certificate/${goalId}`);
      return { 
        goalId, 
        eligible: response.data.verdict === 'eligible',
        verdict: response.data.verdict
      };
    } catch (err) {
      console.error(`Error checking eligibility for goal ${goalId}:`, err);
      return { 
        goalId, 
        eligible: false, 
        verdict: 'Error checking status' 
      };
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchUserGoals();
      } catch (err) {
        console.error('Error initializing:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      const fetchStatuses = async () => {
        const statusPromises = goals.map(goal => checkCertificateEligibility(goal._id));
        const statuses = await Promise.all(statusPromises);
        
        const statusMap = statuses.reduce((acc, status) => {
          acc[status.goalId] = status;
          return acc;
        }, {} as Record<string, CertificateStatus>);
        
        setCertificateStatuses(statusMap);
        setLoading(false);
      };
      
      fetchStatuses();
    } else {
      setLoading(false);
    }
  }, [goals]);

  const handleDownload = (goalId: string) => {
    // TODO: Implement actual certificate download
    alert(`Download certificate for goal: ${goalId}`);
  };

  const getStatusMessage = (verdict: string) => {
    switch (verdict) {
      case 'eligible':
        return 'Certificate Available (Score ≥ 70%)';
      case 'not eligible':
        return 'Not eligible (Score < 70%)';
      default:
        return 'Status unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <StudentNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">My Certifications</h1>

        {loading && (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Checking certificate eligibility...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {goals.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400">
                You have not set any goals yet.
              </p>
            ) : (
              goals.map((goal) => {
                const status = certificateStatuses[goal._id];
                const isEligible = status?.eligible;
                const verdict = status?.verdict || 'unknown';

                return (
                  <div 
                    key={goal._id} 
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {goal.goal}
                      </h2>
                      <p className={`text-sm font-medium ${
                        verdict === 'eligible' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {getStatusMessage(verdict)}
                      </p>
                    </div>
                    
                    {isEligible && (
                      <Button 
                        onClick={() => handleDownload(goal._id)}
                        className="w-full md:w-auto"
                      >
                        Download Certificate
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsPage;