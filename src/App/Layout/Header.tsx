import { Button, Layout, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useMoralis } from 'react-moralis';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { WalletOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const truncate = function (fullStr: string, strLen: number) {
  if (fullStr.length <= strLen) return fullStr;

  const separator = '...';

  const sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, authenticate, isAuthenticating, logout, user } =
    useMoralis();
  // if we'r on root page '/', highlight the dashboard item
  const activeItem = location.pathname.split('/')[1] || 'dashboard';

  return (
    <AntHeader style={{ background: 'white' }}>
      <Menu mode="horizontal" selectedKeys={[activeItem]}>
        <Menu.Item key="dashboard">
          <NavLink to="/">
            <h3 style={{ margin: 0, padding: 0 }}>Dashboard</h3>
          </NavLink>
        </Menu.Item>
        {isAuthenticated ? (
          <SubMenu
            key="SubMenu"
            title={truncate(user?.attributes.ethAddress, 15)}
            style={{ marginLeft: 'auto' }}
            icon={<WalletOutlined />}
          >
            <Menu.Item key="setting:1">
              <Button
                style={{ width: '100%' }}
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Disconnect
              </Button>
            </Menu.Item>
          </SubMenu>
        ) : (
          <Menu.Item key="connect" style={{ marginLeft: 'auto' }}>
            <Button
              loading={isAuthenticating}
              onClick={() => authenticate()}
              type="primary"
            >
              Connect wallet
            </Button>
          </Menu.Item>
        )}
      </Menu>
    </AntHeader>
  );
};

export default Header;
