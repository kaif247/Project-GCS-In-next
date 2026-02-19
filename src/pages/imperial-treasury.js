export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/treasury',
      permanent: false,
    },
  };
}

const ImperialTreasury = () => null;

export default ImperialTreasury;
