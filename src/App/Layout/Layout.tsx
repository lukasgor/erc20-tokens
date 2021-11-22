import { Layout as AntLayout } from 'antd';
import Header from './Header';
import Footer from './Footer';
import React from 'react';

const { Content } = AntLayout;

const Layout: React.FC = ({ children }) => {
  return (
    <AntLayout>
      <Header />
      <Content style={{ padding: '20px 0' }}>{children}</Content>
      <Footer />
    </AntLayout>
  );
};

export default Layout;
