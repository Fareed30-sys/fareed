import React, { useState, useEffect } from 'react';
import { getDashboardSummary, getRecentActivities } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { StatisticsCard } from '../components/dashboard/StatisticsCard';
import { QuickActionCard } from '../components/dashboard/QuickActionCard';
import { UpcomingTasks } from '../components/dashboard/UpcomingTasks';
import { RecentAdvisories } from '../components/dashboard/RecentAdvisories';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { ErrorState } from '../components/common/ErrorState';

export const DashboardPage = () => {
  const { profile } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [sumRes, actRes] = await Promise.all([
        getDashboardSummary(),
        getRecentActivities(),
      ]);
      setSummary(sumRes.data);
      setActivities(actRes.data || []);
    } catch (err) {
      console.error('[DASHBOARD_DATA_ERROR]', err);
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Loading farmer dashboard metrics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Welcome & Farmer Context Card */}
      <WelcomeCard profile={profile || summary?.profile} summary={summary} />

      {/* 2. Key Live Statistics */}
      <StatisticsCard metrics={summary?.metrics} />

      {/* 3. Quick Action Launchpad */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
          Quick Launch Advisory
        </h2>
        <QuickActionCard />
      </div>

      {/* 4. Upcoming Activities & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks tasks={summary?.upcomingTasks || []} />
        <RecentAdvisories activities={activities} />
      </div>
    </div>
  );
};

