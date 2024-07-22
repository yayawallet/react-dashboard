const Support = () => {
  return (
    <div className="-m-4">
      {/* remove layout padding*/}

      <div style={{ height: 'calc(100vh - var(--header-height))' }}>
        {/* height = screen - header */}

        <iframe
          src="https://support.yayawallet.com/widget?website_token=FU7SSnMcYLJ5LFauGSUY5kUA#/"
          height={'100%'}
          width={'100%'}
          title="yaya-support"
        ></iframe>
      </div>
    </div>
  );
};

export default Support;
