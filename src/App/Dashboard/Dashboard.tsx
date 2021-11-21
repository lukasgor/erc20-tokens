import { useMoralis } from 'react-moralis';
import ConnectWalletPrompt from './ConnectWalletPrompt';
import Tokens from './Tokens/Tokens';

const Dashboard = () => {
  const { isAuthenticated } = useMoralis();

  return isAuthenticated ? <Tokens /> : <ConnectWalletPrompt />;
};

export default Dashboard;
