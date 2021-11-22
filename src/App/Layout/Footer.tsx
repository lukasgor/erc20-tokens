import { Layout as AntLayout } from 'antd';

const { Footer: AntFooter } = AntLayout;

const Footer = () => {
  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: 'white',
        zIndex: '100',
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
      }}
    >
      ERC20 Token transfers (Ropsten only)
    </AntFooter>
  );
};

export default Footer;
