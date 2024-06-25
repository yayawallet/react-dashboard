const AboutYaYa = () => {
  return (
    <div style={{ height: 'calc(100vh - var(--header-height) - 2rem)' }}>
      {/* height = screen - header - top and bottom padding of layout */}
      <iframe
        src="https://yayawallet.com/en/about-us"
        height={'100%'}
        width={'100%'}
        title="about yaya"
      ></iframe>
    </div>
  );
};

export default AboutYaYa;
