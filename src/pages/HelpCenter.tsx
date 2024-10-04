const HelpCenter = () => {
  return (
    <div className="overflow-hidden" style={{ height: 'calc(100vh - var(--header-height))' }}>
      {/* height = screen - header - top and bottom padding of layout */}

      <iframe
        src="https://docs.yayawallet.com"
        height={'100%'}
        width={'100%'}
        title="yaya help-center"
        className="relative -top-20 w-full"
        style={{ height: 'calc(100% + 80px)' }}
      ></iframe>
    </div>
  );
};

export default HelpCenter;
