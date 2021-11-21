import React from 'react';
import { message } from 'antd';
import { useMoralis } from 'react-moralis';

export type Token = {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  thumbnail?: string;
  decimals: string;
  balance: string;
};

type ContextType = {
  loading: boolean;
  userTokens: Token[];
  refetch: () => void;
};

const Context = React.createContext<ContextType>({} as ContextType);

let tokenBalanceSubscription: any;

export const TokenBalanceProvider: React.FC = ({ children }) => {
  const { Moralis, user } = useMoralis();
  const [userTokens, setUserTokens] = React.useState<Token[]>([]);
  const [tokensLoading, setTokensLoading] = React.useState(false);

  const fetchTokens = React.useCallback(async () => {
    setTokensLoading(true);
    if (!user) {
      return;
    }
    try {
      const options = { chain: 'ropsten', address: user.get('ethAddress') };
      const balances = await Moralis.Web3API.account.getTokenBalances(options);
      setUserTokens(balances);
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setTokensLoading(false);
    }
  }, [Moralis.Web3API.account, user]);

  React.useEffect(() => {
    Moralis.Web3.enable();
    fetchTokens();
  }, [fetchTokens, Moralis]);

  React.useEffect(() => {
    const subscribeToTransactions = async () => {
      if (!user) {
        return;
      }
      let query = new Moralis.Query('EthTokenTransfers');
      query.equalTo('from_address', user.get('ethAddress'));
      tokenBalanceSubscription = await query.subscribe();
      tokenBalanceSubscription.on('create', () => {
        fetchTokens();
      });
    };
    subscribeToTransactions();

    return () => {
      if (tokenBalanceSubscription) {
        tokenBalanceSubscription.unsubscribe();
        tokenBalanceSubscription = null;
      }
    };
  }, [Moralis, fetchTokens, user]);

  return (
    <Context.Provider
      value={{ userTokens, loading: tokensLoading, refetch: fetchTokens }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
