import { useMedia } from 'react-use';
import TransactionsCard from './TransactionsCard/TransactionsCard';
import TokensBalanceCard from './TokensBalanceCard/TokensBalanceCard';

const Tokens = () => {
  const isMobile = useMedia('(max-width: 767px)');
  return (
    <main
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? '1fr'
          : 'minmax(300px, 600px) minmax(400px, 1fr)',
        gridGap: '20px',
        justifyContent: 'center',
        margin: '0 60px 100px 60px',
      }}
    >
      <TokensBalanceCard />
      <TransactionsCard />
    </main>
  );
};

export default Tokens;
