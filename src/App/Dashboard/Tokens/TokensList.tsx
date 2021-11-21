import { Avatar, Button, List } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import tokenBalance from '../../../utils/tokenBalance';

export type Token = {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  thumbnail?: string;
  decimals: string;
  balance: string;
};

interface Props {
  tokens: Token[];
  setTokenToSend: (v: Token | null) => void;
}

const TokensList: React.FC<Props> = ({ tokens, setTokenToSend }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={tokens}
      renderItem={(item) => (
        <List.Item
          extra={
            <Button
              onClick={() => setTokenToSend(item)}
              icon={<SendOutlined />}
            >
              send
            </Button>
          }
        >
          <List.Item.Meta
            style={{ alignItems: 'baseline' }}
            avatar={
              <Avatar
                src={
                  item.logo ||
                  'https://upload.wikimedia.org/wikipedia/commons/8/80/CyberFM_ERC20_Token_Logo.png'
                }
              />
            }
            title={`${tokenBalance(item.balance, item.decimals)} ${
              item.symbol
            }`}
          />
        </List.Item>
      )}
    />
  );
};

export default TokensList;
