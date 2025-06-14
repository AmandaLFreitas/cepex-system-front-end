import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoadingModal } from "./ui/modal/LoadingModal";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550); // Ajuste este valor para controlar a duração da transição

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <LoadingModal />}
      {children}
    </>
  );
}
