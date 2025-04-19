
'use client'

import DefaultLayout from '@/components/dashComponents/Layouts/DefaultLaout';
import Breadcrumb from '@/components/dashComponents/Breadcrumbs/Breadcrumb';

import dynamic from 'next/dynamic';

const CIDs = dynamic(() => import('@/components/dashComponents/charts/BarGrafic'), { ssr: false });
const Donuts = dynamic(() => import('@/components/dashComponents/charts/circleGrafic'), { ssr: false });
const MultiAxisChart = dynamic(() => import('@/components/dashComponents/charts/multieX'), { ssr: false });
const PieChart = dynamic(() => import('@/components/dashComponents/charts/pieGraph'), { ssr: false });
const TimeChart = dynamic(() => import('@/components/dashComponents/charts/timeChart'), { ssr: false });




export default function DashboardSesmt() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Dashboards" />
      <div className=" z-40 grid grid-cols-2 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-900">
          <CIDs />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-900">
          <Donuts />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-900">
          <PieChart />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-900">
          <MultiAxisChart />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 dark:bg-gray-900">
          <TimeChart />
        </div>
      </div>
    </DefaultLayout>
  );
}
