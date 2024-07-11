import { useGetData } from '../hooks/useSWR';
// import { UserProfile } from '../models';

const Profile = () => {
  const { data: profile } = useGetData('/user/profile');

  return (
    <div className="page-container">
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="flex flex-wrap justify-between px-4 py-5 sm:px-6">
          <div className="">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{profile?.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{'@' + profile?.account}</p>
          </div>

          <dl className="">
            <dt className="text-sm font-medium text-gray-500 px-3 py-1">Status</dt>
            <dd
              className={`flex items-center justify-center mt-1 text-sm px-3 py-1 text-gray-800 sm:mt-0 sm:col-span-3 font-medium rounded ${profile?.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              {profile
                ? `${profile?.status?.charAt(0)}${profile?.status?.slice(1).toLowerCase()}`
                : '- - -'}
            </dd>
          </dl>
        </div>
        <div className="border-t border-l border-r rounded-lg border-gray-200 px-4 py-5 sm:p-0 max-w-[800px] mx-auto">
          <dl className="sm:divide-y sm:divide-gray-200 text-[15px]">
            <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">{profile?.account}</dd>
            </div>
            <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">{profile?.email}</dd>
            </div>
            <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">
                {profile && `(${profile?.country?.phone_code}) ${profile?.phone}`}
              </dd>
            </div>
            <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">{profile?.location}</dd>
            </div>

            <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Guardians</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">
                {profile?.guardians.join(', ')}
              </dd>
            </div>

            <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Reputation</dt>
              <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">{profile?.reputation}</dd>
            </div>

            <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Balance Limit</dt>
              <dd className="mt-1 text-gray-900 font-medium sm:mt-0 sm:col-span-3">
                {profile && profile.type === 'BUSINESS'
                  ? 'Unlimited'
                  : profile?.currency + ' ' + profile?.balance_limit?.toLocaleString()}
              </dd>
            </div>

            <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <dt className="font-medium text-gray-500">Daily transaction limit</dt>
              <dd className="mt-1 text-gray-900 font-medium sm:mt-0 sm:col-span-3">
                {profile && profile.type === 'BUSINESS'
                  ? 'Unlimited'
                  : profile?.currency + ' ' + profile?.daily_transaction_limit?.toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
