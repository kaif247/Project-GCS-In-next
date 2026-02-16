import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProductsRoute = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/treasury');
  }, [router]);

  return null;
};

export default ProductsRoute;
