import { useState } from 'react';

const Support = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="-m-4">
      {/* remove layout padding*/}

      <div style={{ height: 'calc(100vh - var(--header-height))' }}>
        {/* height = screen - header */}

        {isLoading ? (
          <div className="flex justify-center pt-40">
            <div className="loader"></div>
          </div>
        ) : (
          <iframe
            src="https://support.yayawallet.com/widget?website_token=FU7SSnMcYLJ5LFauGSUY5kUA#/"
            height={'100%'}
            width={'100%'}
            title="yaya-support"
            onLoad={() => setIsLoading(false)}
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Support;
