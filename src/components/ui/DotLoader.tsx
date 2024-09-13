import './DotLoader.css';

export const SmallLoading = () => {
  return (
    <div className="h-6 w-6">
      <div className="container small">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export const MediumLoading = () => {
  return (
    <div className="h-10 w-10">
      <div className="container medium">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};
