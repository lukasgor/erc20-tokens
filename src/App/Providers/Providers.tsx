import { MoralisProvider } from 'react-moralis';
import { TokenBalanceProvider } from './TokenBalance';

const Providers: React.FC = ({ children }) => {
  return (
    <MoralisProvider
      appId="Vceci5R2zfBtlc5qmoFNg2BLGu1HCqPb7O2DE2GI"
      serverUrl="https://jzrofsnpcsdi.usemoralis.com:2053/server"
    >
      <TokenBalanceProvider>{children}</TokenBalanceProvider>
    </MoralisProvider>
  );
};

export default Providers;
