import { Button, Result } from 'antd';
import { useMoralis } from 'react-moralis';

const ConnectWalletPrompt = () => {
  const { authenticate, isAuthenticating } = useMoralis();
  return (
    <Result
      title="Connect your wallet"
      subTitle={
        <p>
          You need to have a{' '}
          <a href="https://metamask.io/" target="_blank" rel="noreferrer">
            metamask
          </a>{' '}
          extension installed in order to use this application, then click the
          button below to continue.
        </p>
      }
      extra={
        <Button
          loading={isAuthenticating}
          onClick={() => authenticate()}
          size="large"
          type="primary"
        >
          Connect wallet
        </Button>
      }
      style={{
        background: 'white',
      }}
    />
  );
};

export default ConnectWalletPrompt;
