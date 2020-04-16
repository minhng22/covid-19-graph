import { Layout, Menu } from 'antd';
import React from 'react'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FileSearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import DailyCaseView from './DailyCase'

const { Header, Sider, Content, Footer } = Layout;

export default class Route extends React.Component {
  state = {
    collapsed: false,
    menu_item: 'DAILY_CASE'
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  switch_menu_item = (key) => {
      if (this.MENU_ITEMS.includes(key)){
          this.setState({menu_item: key})
      } else {
          console.log('Invalid key option: ', key)
      }
  }

  MENU_ITEMS = ['DAILY_CASE', 'ANALYZE', 'DATA_SOURCE']

  get_menu_item_title = (key) => {
    switch (key) {
        case 'DAILY_CASE':
            return 'Daily Case'
        case 'ANALYZE':
            return 'Analyze'
        case 'DATA_SOURCE':
            return 'Data Source'
        default:
            console.log('Invalid key option WARNING.')
            break
      }
  }

  get_menu_item_page_header = (key) => {
    switch (key) {
        case 'DAILY_CASE':
            return 'Daily cases of COVID-19'
        case 'ANALYZE':
            return 'Analyze COVID-19 Data'
        case 'DATA_SOURCE':
            return 'Data Source and Credit'
        default:
            console.log('Invalid key option WARNING.')
            break
      }
  }

  get_menu_item_page = (key) => {
    switch (key) {
        case 'DAILY_CASE':
            return (<DailyCaseView/>)
        case 'ANALYZE':
            return 'Analyze COVID-19 Data'
        case 'DATA_SOURCE':
            return 'Data Source and Credit'
        default:
            console.log('Invalid key option WARNING.')
            break
      }
  }

  get_menu_item_icon = (key) => {
    switch (key) {
        case 'DAILY_CASE':
            return <UserOutlined/>
        case 'ANALYZE':
            return <FileSearchOutlined/>
        case 'DATA_SOURCE':
            return <UploadOutlined/>
        default:
            console.log('Invalid key option WARNING.')
            break
      }
  }

  render() {
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className='logo' />
          <Menu theme='dark' mode='inline' defaultSelectedKeys={[this.state.menu_item]}>
              {
                  this.MENU_ITEMS.map(menu_item => (
                    <Menu.Item key= {menu_item} onClick = {() =>this.switch_menu_item(menu_item)}>
                        {this.get_menu_item_icon(menu_item)}
                        <span>{this.get_menu_item_title(menu_item)}</span>
                    </Menu.Item>
                  ))
              }
          </Menu>
        </Sider>
        <Layout className='site-layout'>
          <Header className='site-layout-background' style={{ padding: 0 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
            {this.get_menu_item_page_header(this.state.menu_item)}
          </Header>
          <Content
            className='site-layout-background'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            {this.get_menu_item_page(this.state.menu_item)}
          </Content>
          <Footer style={{ textAlign: 'center' }}>Created by Minh Nguyen</Footer>
        </Layout>
      </Layout>
    );
  }
}