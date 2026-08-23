const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const sizeClass = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
  }[size];

  const spinner = (
    <div
      className={`${sizeClass} border-primary border-t-transparent
                    rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-16">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
