import { Card, Skeleton } from 'antd';
import React from 'react';
import { useMedia } from 'react-use';
import TokensList from './TokensList';
import { Token } from './TokensList';
import TokenSendModal from './TokenSendModal';
import TokenBalanceContext from '../../Providers/TokenBalance';
import TransfersInfo from './TransfersInfo';

const Tokens = () => {
  const [tokenToSend, setTokenToSend] = React.useState<Token | null>(null);
  const { loading, userTokens } = React.useContext(TokenBalanceContext);
  const isMobile = useMedia('(max-width: 767px)');
  return (
    <div
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
      {tokenToSend && (
        <TokenSendModal
          onDismiss={() => setTokenToSend(null)}
          token={tokenToSend}
        />
      )}
      <Card style={{ height: 'fit-content' }} title="ERC20 Tokens">
        {loading ? (
          <Skeleton />
        ) : userTokens && userTokens.length ? (
          <TokensList tokens={userTokens} setTokenToSend={setTokenToSend} />
        ) : (
          'No ERC20 tokens found.'
        )}
      </Card>
      <TransfersInfo />
    </div>
  );
};

export default Tokens;
