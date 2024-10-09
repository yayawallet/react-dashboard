import RefreshButton from '../components/ui/RefreshButton';
import { useGetData } from '../hooks/useSWR';

const Profile = () => {
  const { data: profile } = useGetData('/user/profile');
  const { data: balance, isValidating, mutate: mutateBalance } = useGetData('/user/balance');

  return (
    <div className="page-container">
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="flex flex-wrap justify-between p-4 sm:px-6 border-b">
          <div className="">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {profile?.name}
              {profile?.is_agent ? <span className="text-gray-500 font-normal"> (Agent)</span> : ''}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{'@' + profile?.account}</p>

            <h4 className="mt-8 text-lg">
              Balance: {balance && !isValidating ? Number(balance)?.toFixed(2) : ' ... '}
              &nbsp;
              <span className="text-gray-500">ETB</span>
            </h4>
          </div>

          <div className="flex flex-col justify-between items-center">
            <dl>
              <dt className="text-sm font-medium text-gray-500 px-3 pb-0.5">Status</dt>
              <dd
                className={`flex self-center items-center justify-center mt-1 text-sm px-3 pb-0.5 text-gray-800 sm:mt-0 sm:col-span-3 font-medium rounded ${profile?.status === 'ACTIVE' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
              >
                {profile
                  ? `${profile?.status?.charAt(0)}${profile?.status?.slice(1).toLowerCase()}`
                  : '- - -'}
              </dd>
            </dl>

            <span onClick={() => mutateBalance()}>
              <RefreshButton />
            </span>
          </div>
        </div>

        <div className="flex flex-wrap xl:flex-nowrap">
          <div className="border-t border-r border-b xl:border-b-0 rounded-l-lg border-gray-200 px-4 py-5 sm:p-0 max-w-[800px]">
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
                <dd className="mt-1 text-gray-700 sm:mt-0 sm:col-span-3">
                  {profile?.guardians.map((g: string) => `@${g}`).join(', ')}
                </dd>
              </div>

              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <dt className="font-medium text-gray-500">Reputation</dt>
                <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-3">{profile?.reputation}</dd>
              </div>

              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <dt className="font-medium text-gray-500">Balance Limit</dt>
                <dd className="mt-1 text-gray-900 font-medium sm:mt-0 sm:col-span-3">
                  {profile
                    ? profile.type === 'BUSINESS'
                      ? 'Unlimited'
                      : profile?.currency + ' ' + profile?.balance_limit?.toLocaleString()
                    : '~'}
                </dd>
              </div>

              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <dt className="font-medium text-gray-500">Daily transaction limit</dt>
                <dd className="mt-1 text-gray-900 font-medium sm:mt-0 sm:col-span-3">
                  {profile
                    ? profile.type === 'BUSINESS'
                      ? 'Unlimited'
                      : profile?.currency + ' ' + profile?.daily_transaction_limit?.toLocaleString()
                    : '~'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex xl:flex-1 justify-center items-center">
            <div className="max-w-[300px]">
              <img src={profile?.photo_url} alt="" className="inline-block rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
