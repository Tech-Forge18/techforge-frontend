import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import UserMetaCard from '@/components/profile/UserMetaCard';
import UserInfoCard from '@/components/profile/UserInfoCard';


function index() {
  return (
    <MainLayout>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          
        </div>
      </div>
    </MainLayout>
    )
}

export default index
