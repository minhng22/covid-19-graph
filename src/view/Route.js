import { Layout, Menu, Row, Col } from 'antd';
import React from 'react'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FileSearchOutlined,
  UploadOutlined,
  WarningOutlined
} from '@ant-design/icons';

import DailyCaseView from './DailyCase'

const { Header, Sider, Content, Footer } = Layout;

export default class Route extends React.Component {
  constructor(props){
    super(props)
  }
  state = {
    collapsed: false,
    menu_item: 'DAILY_CASE',
    menu_page: {}
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  switch_menu_item = (key) => {
    console.log('Switching to ', key)
      if (this.MENU_ITEMS.includes(key)){
          this.setState({menu_item: key})
      } else {
          console.log('Invalid key option: ', key)
      }
  }

  componentDidMount = ()=>{
    this.setState({menu_page: <DailyCaseView medica="POSITIVE"/>})
  }

  MENU_ITEMS = ['DAILY_CASE', 'DAILY_DEATH_CASE', 'ANALYZE', 'DATA_SOURCE']

  get_menu_item_title = (key) => {
    switch (key) {
        case 'DAILY_CASE':
            return 'Daily Case'
        case 'DAILY_DEATH_CASE':
              return 'Daily Death Case'
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
        case 'DAILY_DEATH_CASE':
            return 'Daily death cases of COVID-19'
        case 'ANALYZE':
            return 'Analyze COVID-19 Data'
        case 'DATA_SOURCE':
            return 'Data Source and Credit'
        default:
            console.log('Invalid key option WARNING.')
            break
      }
  }

  get_menu_item_icon = (props) => {
    switch (props) {
        case 'DAILY_CASE':
            return <UserOutlined/>
        case 'DAILY_DEATH_CASE':
            return <WarningOutlined/>
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
          <Header className='site-layout-background' style={{ padding: '0 24px'}}>
            <Row>
              <Col span="1">
                {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  onClick: this.toggle,
                })}
              </Col>
              <Col style={{textAlign: "center"}} span= "23">
                {this.get_menu_item_page_header(this.state.menu_item)}
              </Col>
            </Row>
          </Header>
          <Content
            className='site-layout-background'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
              {(() => {
                if (this.state.menu_item === 'DAILY_CASE') return <DailyCaseView medica = "POSITIVE"/>}
                )()}
              {(() => {
                if (this.state.menu_item === 'DAILY_DEATH_CASE') return <DailyCaseView medica = "DEATH"/>}
                )()}
              {(() => {
                if (this.state.menu_item === 'ANALYZE') return (<div>Analyze COVID-19 Data</div>)}
                )()}
              {(() => {
                if (this.state.menu_item === 'DATA_SOURCE') return (<div>Data Source and Credit</div>)}
                )()}
          </Content>
          <Footer style={{ textAlign: 'center' }}>Created by Minh Nguyen</Footer>
        </Layout>
      </Layout>
    );
  }
}