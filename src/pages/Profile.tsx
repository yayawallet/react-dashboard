// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { UserProfile } from '../models';
import useFetchData from '../hooks/useFetchData';

const Profile = () => {
  // const [profile, setProfile] = useState<UserProfile>();

  // useEffect(() => {
  //   axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`).then((res) => setProfile(res.data));
  // }, []);

  const { data: profile } = useFetchData(['profile'], '/user/profile');

  return (
    <div className="container">
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="flex flex-wrap justify-between px-4 py-5 sm:px-6">
          <div className="">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{profile?.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{'@' + profile?.account}</p>
          </div>

          <div className="">
            <dt className="text-sm font-medium text-gray-500 px-3 py-1">Status</dt>
            <dd
              className={`flex items-center justify-center mt-1 text-sm px-3 py-1 text-gray-800 sm:mt-0 sm:col-span-2 font-medium rounded ${profile?.status === 'ACTIVE' ? 'bg-green-500 text-slate-100' : 'bg-gray-100'}`}
            >
              {profile
                ? `${profile?.status?.charAt(0)}${profile?.status?.slice(1).toLowerCase()}`
                : '- - -'}
            </dd>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.account}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.email}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile && `(${profile?.country?.phone_code}) ${profile?.phone}`}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.location}
              </dd>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Guardians</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.guardians.join(', ')}
              </dd>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Reputation</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.reputation}
              </dd>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Balance Limit</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile && profile?.currency + ' ' + profile?.balance_limit?.toLocaleString()}
              </dd>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Daily transaction limit</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile &&
                  profile?.currency + ' ' + profile?.daily_transaction_limit?.toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
