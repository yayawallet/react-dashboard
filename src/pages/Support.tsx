const Support = () => {
  return (
    <div style={{ height: 'calc(100vh - var(--header-height) - 2rem)' }}>
      {/* height = screen - header - top and bottom padding of layout */}

      <iframe
        src="https://support.yayawallet.com/widget?website_token=FU7SSnMcYLJ5LFauGSUY5kUA#/"
        height={'100%'}
        width={'100%'}
        title="yaya-support"
      ></iframe>
    </div>
  );
};

export default Support;
