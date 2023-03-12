import React, { useEffect, useState, Suspense } from "react";
import { Loading } from "../components/ui/loading/Loading";

const LoadingWithGraceTime = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 300); // 300ms grace time allowed to load

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return isLoading ? <Loading /> : null;
};

const withSuspense = (WrappedComponent) => {
  return (props) => {
    return (
      <Suspense fallback={<LoadingWithGraceTime />}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
};

export default withSuspense;
