export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/imperial-treasury',
      permanent: true,
    },
  };
}

const TreasuryRedirect = () => null;

export default TreasuryRedirect;
