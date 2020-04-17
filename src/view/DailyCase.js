import React, { PureComponent } from 'react' 
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts' 
import axios from 'axios'
import { Checkbox, Layout, Select, Input, Button, Tooltip as AntdToolTip, List, Spin} from 'antd'
import { UserOutlined, SearchOutlined } from '@ant-design/icons';

const {Content} = Layout
const {Option} = Select

export default class DailyCaseView extends PureComponent {
    state = {
        chart_data: [],
        analyze_opt : [
          { label: 'Capita Percentage', value: 'CAPITA_PERCENTAGE' },
          { label: 'Latest Only', value: 'LATEST_ONLY' },
          { label: 'Daily New Case', value: 'DAILY_NEW_CASE' },
          { label: 'Death Case', value: 'DEATH_CASE' }
        ],
        selected_analyze_opt :{
          'CAPITA_PERCENTAGE': 'FALSE',
          'LATEST_ONLY': 'FALSE',
          'DAILY_NEW_CASE': 'FALSE',
          'DEATH_CASE': 'FALSE'
        },
        querying_territory: {},
        selected_territory: {},
        selected_capita: '1000',
        provided_countries: [],
        provided_states: [],
        provided_counties: [],
        displayed_countries: {},
        displayed_states: {},
        displayed_counties: {},
        loading_chart_data: false
    }

    REMOTE_HOST_URL = 'https://covid19-tracking-api.herokuapp.com/api'
    ANALYZE_EP = '/case-analyze'
    COUNTRY = '/country'
    STATE = '/state'
    COUNTY = '/county'

    componentDidMount(){
      this.load_provided_countries()
      this.load_chart_data()
    }

    load_provided_countries = () => {
      axios.get( this.REMOTE_HOST_URL + this.COUNTRY, {
        params: this.state.selected_analyze_opt
      }).then(res => {
        console.log('Countries preloaded: ', res.data)
        this.setState({ provided_countries: res.data })
      })
    } 

    get_analyze_params = () => {
      let p = this.state.selected_analyze_opt
      p['territory_id'] = this.state.querying_territory ? this.state.querying_territory['territory_id']: []
      p['territory_type'] = this.state.querying_territory? this.state.querying_territory['territory_type']: []
      p['territory_capita'] = this.state.querying_territory? this.state.querying_territory['territory_capita']: []
      
      console.log('Analyze params ', p)
      return p
    }

    get_presentable_querrying_ter = () => {
      let p = {}
      let pq = []

      p['territory_id'] = this.state.querying_territory ? this.state.querying_territory['territory_id']: []
      p['territory_type'] = this.state.querying_territory? this.state.querying_territory['territory_type']: []
      p['territory_capita'] = this.state.querying_territory? this.state.querying_territory['territory_capita']: []
      p['name'] = this.state.querying_territory? this.state.querying_territory['name']: []

      if (p['territory_id']) {
        for (let i= 0; i < p['territory_id'].length; i++){
          pq.push({
            'territory_id': p['territory_id'][i],
            'territory_type': p['territory_type'][i],
            'territory_capita': p['territory_capita'][i],
            'name': p['name'][i]
          })
        }
      }

      console.log('Presentable querrying ter: ', pq)

      return pq
    }

    load_chart_data = () => {
      this.setState({loading_chart_data: true})
      axios.get( this.REMOTE_HOST_URL + this.ANALYZE_EP, {
          params: this.get_analyze_params()
        })
      .then(res => {
          this.setState({loading_chart_data: false})
          console.log(res)
          if (res.data.length > 0){
            const chart_data = this.convert_res_to_chart_data(res.data)
            console.log('Chart data ', chart_data)
            this.setState({ chart_data })
          } else {
            this.setState({ chart_data: [] })
          }
      })
    }

    on_select_analyze_opt = (checked_values) =>{
      console.log('Val is ', checked_values)
      let new_aso = this.state.selected_analyze_opt

      this.setState({
        selected_analyze_opt :{
          'CAPITA_PERCENTAGE': 'FALSE',
          'LATEST_ONLY': 'FALSE',
          'DAILY_NEW_CASE': 'FALSE',
          'DEATH_CASE': 'FALSE'
        }
      })
      for (let c of checked_values) {
        new_aso[c] = 'TRUE'
      }
      console.log(new_aso)
      this.setState({
        analyze_selected_options: new_aso
      })
      this.load_chart_data()
    }

    on_select_country = (sel_country) => {
      console.log('selected country',sel_country)
      this.update_selected_territory(sel_country, 'COUNTRY')
      const p = this.state.selected_analyze_opt
      p.country_id = sel_country

      console.log('Select Country PARAMS ', p)

      axios.get( this.REMOTE_HOST_URL + this.STATE, {
        params: p
      }).then(res => {
        console.log('State preloaded: ', res.data)
        this.setState({ provided_states: res.data })
      })
    }

    update_selected_territory = (sel, sel_type) => {
      let ter
      if (sel_type === 'COUNTRY') {
        ter = this.find_territory(sel, this.state.provided_countries)
      } else if (sel_type === 'STATE') {
        ter = this.find_territory(sel, this.state.provided_states)
      } else if (sel_type === 'COUNTY') {
        ter = this.find_territory(sel, this.state.provided_counties)
      } 

      console.log(ter)
      this.setState({
        selected_territory: {
          'name': ter.name,
          'territory_id': ter._id,
          'territory_type': sel_type
        }})

      this.state[(sel_type === 'COUNTRY') ? 'displayed_countries': (sel_type === 'STATE')? 'displayed_states' : 'displayed_counties'] ={
        'name': ter.name,
        'territory_id': ter._id,
        'territory_type': sel_type
      }
    }

    find_territory = (item_id, list) => {
      for (let l of list) {
        if (l['_id'] === item_id) {
          return l
        }
      }
    }

    on_select_state = (sel_state) => {
      this.update_selected_territory(sel_state, 'STATE')
      const p = this.state.selected_analyze_opt
      p['state_id'] = sel_state

      console.log('Select State PARAMS ', p)

      axios.get( this.REMOTE_HOST_URL + this.COUNTY, {
        params: p
      }).then(res => {
        console.log('County preloaded: ', res.data)
        this.setState({ provided_counties: res.data })
      })
    }

    on_select_county = (sel_county) => {
      this.update_selected_territory(sel_county, 'COUNTY')
    }

    on_input_caputa = (selected_capita) => {
      this.setState({selected_capita})
    }

    add_new_querrying_ter = () => {
      let q = this.state.querying_territory
      if (q['territory_id']) q['territory_id'].push(this.state.selected_territory['territory_id']) 
      else q['territory_id'] = [this.state.selected_territory['territory_id']]

      if (q['territory_type']) q['territory_type'].push(this.state.selected_territory['territory_type']) 
      else q['territory_type'] = [this.state.selected_territory['territory_type']]

      if (q['territory_capita']) q['territory_capita'].push(this.state.selected_capita) 
      else q['territory_capita'] = [this.state.selected_capita]

      if (q['name']) q['name'].push(this.state.selected_territory['name']) 
      else q['name'] = [this.state.selected_territory['name']]

      this.load_chart_data()
      this.clear_selecter()
      this.clear_display_ter()
      this.get_presentable_querrying_ter()
      console.log('Clearing display: ', this.state)

    }

    find_ter_name = (id) =>{
      if (this.state.querying_territory['territory_id']) {
        for (let i= 0; i < this.state.querying_territory['territory_id'].length; i++){
          if (this.state.querying_territory['territory_id'][i] === id){
            return this.state.querying_territory['name'][i]
          }
        }
      }
    }

    convert_res_to_chart_data = (data) => {
      let chart_data = []
      const time_series = Object.keys(data[0]['case'])
      for (let t of time_series){
          let chart_data_temp_o = {}
          chart_data_temp_o['name'] = t
          for (let d of data){
              chart_data_temp_o[d['territory_type'] + ' ' + this.find_ter_name(d['territory_id'])] = parseInt(d['case'][t])
          }
          chart_data.push(chart_data_temp_o)
      }
      console.log(chart_data)
      return chart_data
    }

    clear_selecter = () => {
      this.setState({
        selected_territory: {},
        selected_capita: '1000'
      })
    }

    clear_display_ter = () => {
      this.setState({
        displayed_countries: {},
        displayed_states: {},
        displayed_counties: {}
      })
    }

    load_chart_ui = () => {
      if (this.state.loading_chart_data) {
        return (
          <div>
            <Spin tip="Loading chart data"/>
          </div>
        )
      } else {
        return (
          <LineChart
            width={1300}
            height={800}
            data={this.state.chart_data}
            margin={{
              top: 50, right: 50, left: 100, bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            {
              this.get_presentable_querrying_ter().map (ter => (
                <Line type='monotone' dataKey={ter.territory_type+ " " + ter.name} stroke='#8884d8' activeDot={{ r: 8 }} />
              ))
            }
            <Legend />
          </LineChart>
        )
      }
    }

  render() {
    return (
      <Content
            className='site-layout-background'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            Querrying territory:
            <List
              itemLayout="horizontal"
              dataSource={this.get_presentable_querrying_ter()}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description = {item.territory_type + ". Capita: " + item.territory_capita}
                  />
                </List.Item>
              )}
            />
            Country: 
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a country"
              optionFilterProp="children"
              onChange={this.on_select_country}
              value = {this.state.displayed_countries['name']}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                this.state.provided_countries.map(country => (
                  <Option value= {country._id}>{country.name}</Option>
                ))
              }
            </Select>
            
            State: 
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a state"
              optionFilterProp="children"
              onChange={this.on_select_state}
              value = {this.state.displayed_states['name']}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                this.state.provided_states.map(state => (
                  <Option value= {state._id}>{state.name}</Option>
                ))
              }
            </Select>
            
            County: 
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a county"
              optionFilterProp="children"
              onChange={this.on_select_county}
              value = {this.state.displayed_counties['name']}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                this.state.provided_counties.map(county => (
                  <Option value= {county._id}>{county.name}</Option>
                ))
              }
            </Select>

            <Input size="large" defaultValue = "1000" placeholder="Input capita" prefix={<UserOutlined />} onChange = {this.on_input_caputa}/>
            <AntdToolTip title="search">
              <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick = {this.add_new_querrying_ter}/>
            </AntdToolTip>
            <br/>
            <Checkbox.Group options={this.state.analyze_opt} onChange={this.on_select_analyze_opt} />
            <br/>
            {this.load_chart_ui()}
      </Content>
    ) 
  }
}