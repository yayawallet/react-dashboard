const LoginForm = () => {
  return (
    <form className="space-y-4 md:space-y-6 py-4" action="#">
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
          Your username
        </label>
        <input
          type="username"
          name="username"
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5"
          placeholder="username"
          autoComplete="username"
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-violet-300"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="remember" className="text-gray-500">
              Remember me
            </label>
          </div>
        </div>
        <a href="#" className="text-sm font-medium text-violet-600 hover:underline">
          Forgot password?
        </a>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Sign in
      </button>
    </form>
  );
};

export default LoginForm;
