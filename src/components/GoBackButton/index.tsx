import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const GoBackButton = () => {
  const router = useRouter();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const handleBack = () => {
    router.back(); 
  };

  return (
    <button onClick={handleBack} style={{ border: 'none', background: 'transparent' }}>
        <MdOutlineArrowBackIosNew />
    </button>
  );
};

export default GoBackButton;
