const HelpCenter = () => {
  return (
    <div style={{ height: 'calc(100vh - var(--header-height) - 2rem)' }}>
      {/* height = screen - header - top and bottom padding of layout */}

      <iframe
        src="https://docs.yayawallet.com"
        height={'100%'}
        width={'100%'}
        title="yaya help-center"
      ></iframe>
    </div>
  );
};

export default HelpCenter;
