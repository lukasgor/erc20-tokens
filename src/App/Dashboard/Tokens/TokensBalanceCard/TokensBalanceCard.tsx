import React from 'react';
import { Card, Skeleton } from 'antd';
import TokenBalanceContext from '../../../Providers/TokenBalance';
import TokensList, { Token } from './TokensList';
import TokenSendModal from './TokenSendModal';

const TokensBalanceCard = () => {
  const [tokenToSend, setTokenToSend] = React.useState<Token | null>(null);
  const { loading, userTokens } = React.useContext(TokenBalanceContext);
  return (
    <>
      {tokenToSend && (
        <TokenSendModal
          onDismiss={() => setTokenToSend(null)}
          token={tokenToSend}
        />
      )}
      <Card
        style={{ height: 'fit-content' }}
        title={<h3 style={{ margin: 0, padding: 0 }}>ERC20 Tokens</h3>}
      >
        {loading ? (
          <Skeleton />
        ) : userTokens && userTokens.length ? (
          <TokensList tokens={userTokens} setTokenToSend={setTokenToSend} />
        ) : (
          'No ERC20 tokens found.'
        )}
      </Card>
    </>
  );
};

export default TokensBalanceCard;
