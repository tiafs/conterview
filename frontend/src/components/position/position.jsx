import React from 'react';
import { Button, Table, Pagination, Input, Header } from 'semantic-ui-react';
import PageWrap from '../header/page-wrap';
import './position.css';
import { getPositions } from '../../api/position-api';
import { Link } from 'react-router-dom';
import { PageHeader, Breadcrumb, Space } from 'antd';
import CreateEditPosition from './create-edit-position';

class Position extends React.Component {
  constructor(){
    super();
    this.state = {
      createPosModal:false, 
      positions:[],
      totalPage:1,
      page:1,
      nameContains:'',
    };
    this.fetchData();
  }

  fetchData = () => {
    getPositions('', this.state.page, this.state.nameContains, res => {
      this.setState({positions: res.data.positions, totalPage: res.data.totalPage});
    });
  };

  setCreatePosModal = (open) => this.setState({createPosModal: open});

  onPageChange = (e, pageInfo) => {
    this.state.page = pageInfo.activePage;
  	this.fetchData();
  };

  onSearch = (e) => {
    this.state.page = 1;
    this.fetchData();
  };

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  render() {   
    let tableBody = this.state.positions.map((position) => {
      return (
        <Table.Row onClick={()=>{this.props.history.push('/position/'+position._id)}}>
          <Table.Cell>{position.name}</Table.Cell>
          <Table.Cell>{position.pendingInterviewNum}</Table.Cell>
          <Table.Cell>{position.finishedInterviewNum}</Table.Cell>
        </Table.Row>
      );
    });

    const routes = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to='/position'>Position</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );
    
    return (
      <PageWrap selected='position'>
        <PageHeader
          title="Position"
          style={{backgroundColor:'white',marginTop:'5px'}}
          extra={[
            <Button color='green' onClick={() => this.setCreatePosModal(true)}>Create Position</Button>,
          ]}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{backgroundColor:'white', padding:'20px', margin:'25px', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <Space>
            <Header>Name:</Header>
            <Input 
              name='nameContains'
              onChange={this.handleInputChange}
              placeholder='Search by name'
            />
          </Space>
          <Button color='blue' onClick={this.onSearch} >Search</Button>
        </div>
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px'}}>
          <Table striped basic='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width='8'>Name</Table.HeaderCell>
                <Table.HeaderCell width='1'>Pending</Table.HeaderCell>
                <Table.HeaderCell width='1'>Finished</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tableBody}
            </Table.Body>
          </Table>
          <Pagination activePage={this.state.page} onPageChange={this.onPageChange} totalPages={this.state.totalPage} />
        </div>
        <CreateEditPosition
          open={this.state.createPosModal}
          onClose={() => this.setCreatePosModal(false)}
          onSubmit={() => {
            this.setCreatePosModal(false);
            this.fetchData();
          }}
        >
        </CreateEditPosition>
      </PageWrap>
    );
  }
}

export default Position;