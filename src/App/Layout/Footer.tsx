import { Layout as AntLayout } from 'antd';

const { Footer: AntFooter } = AntLayout;

const Footer = () => {
  return (
    <AntFooter style={{ textAlign: 'center', background: 'white' }}>
      ERC20 Token transfers (Ropsten only)
    </AntFooter>
  );
};

export default Footer;
