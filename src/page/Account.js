import Layout from '../Layout'
import MenuBar from '../components/MenuBar'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import { Card } from '@material-ui/core'
import _ from 'lodash'
import AWS from 'aws-sdk'

import {
  ButtonToggle,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from 'reactstrap'
import { FullWidthButton, InputGrid } from '../Landing'
import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import * as firebase from 'firebase'
import CardActionArea from '@material-ui/core/CardActionArea'
import DeleteIcon from '@material-ui/icons/Delete'
import { Table } from 'antd'
import { BitlyClient } from 'bitly'
import Navbar from '../components/Navbar'
const InputGroupIcon = styled(InputGroupText)`
  background: none;
  border-left: 0px;
  border-radius: 50px;
`
const InputField = styled(Input)`
  border-right: 0px;
  border-radius: 50px;
`
const Text = styled.p`
  white-space: pre-wrap;
  font-family: Kanit !important;
  font-size: ${(props) => props.size}px;
  margin-bottom: 0;
`
const ScrollingWrapper = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
`
const CardItem = styled(Card)`
  display: inline-block;
  margin: 20px;
  padding: 20px;
  width: 400px;
  height: 200px;
  background-color: ${({ selected }) => {
    return selected ? '#29a2d7' : '#FFFFF'
  }}!important;
`
const Contents = styled(Grid)`
  -webkit-box-shadow: 0 4px 6px -6px #222;
  -moz-box-shadow: 0 4px 6px -6px #222;
  box-shadow: 0 4px 6px -6px #222;
  background-color: #ffffff;
  padding: 20px;
  margin: 20px;
`

const SPACES_KEY = '7L5CXYDG6YD6ZT5I7NBA'
const SPACES_SECRET = 'jF0h/5ZWvGzhrisOjUdNzvP5S8IMfkoSni6seDS+FVk'
const SPACES_NAME = 'ndf.server.bim'
const SPACES_ENDPOINT = 'sgp1.digitaloceanspaces.com'
const url = 'https://ndf.server.bim.sgp1.cdn.digitaloceanspaces.com/'
const Account = (props) => {
  const spacesEndpoint = new AWS.Endpoint(SPACES_ENDPOINT)

  const [user, setCurrentUser] = useState({})
  const bucketUrl = `https://${SPACES_NAME}.${SPACES_ENDPOINT}/`

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: SPACES_KEY,
    secretAccessKey: SPACES_SECRET,
  })

  const database = firebase.database()
  const [modelList, setModelList] = useState([])
  const [selected, setSelected] = useState('all')
  const [users, setUsers] = useState([])
  const [memberForm, setForm] = useState({})
  const [projectFile, setProjectFile] = useState(null)
  const [memberEditForm, setEditForm] = useState({})

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .database()
          .ref(`/user/${user.uid}`)
          .once('value', (data) => {
            //console.log('current user', data.val())
            setCurrentUser({ ...data.val(), uid: user.uid })

            firebase
              .database()
              .ref('/models')
              .on('value', (snap) => {
                //console.log('setModelList', user)

                let output = []
                _.forEach(snap.val(), (item, index) => {
                  _.forEach(item.users, (member) => {
                    if (member.uid === user.uid) {
                      //console.log('Member', member.uid === user.uid)
                      output.push({ ...item, key: index })
                    }
                  })
                })
                setModelList(output)
              })
          })
      } else {
        // No user is signed in.
      }
    })
    database.ref('/user').once('value', (snap) => {
      setUsers(
        _.map(snap.val(), (item, index) => ({
          ...item,
          uid: index,
        }))
      )
    })

    document.getElementsByTagName('body')[0].className = 'defaultLayout'
  }, [])
  if (user.status <= 1){ window.location='404.html'}
  else if(user.status >= 4){window.location='404.html'}

  // const columns = [
  //   {
  //     title: '#',

  //     render: (text) => <img src={'/user.png'} />,
  //   },
  //   {
  //     title: '????????????',

  //     render: (item) => {
  //       const { firstName = '', lastname = '' } = item
  //       //console.log('item', item)
  //       return `${firstName} ${lastname}`
  //     },
  //   },
  //   {
  //     title: '??????????????????',
  //     render: (item) => {
  //       const { company = '' } = item
  //       //console.log('item', item)
  //       return `${company}`
  //     },
  //   },
  //   {
  //     title: '?????????????????????',

  //     render: (item) => {
  //       return _.map(modelList, (project) => {
  //         if (_.find(project.users, (user) => item.uid === user.uid)) {
  //           return `${project.projectName || project.name},`
  //         } else {
  //           return null
  //         }
  //       })
  //     },
  //   },
  // ]

  return (
    <div
      style={{
        padding: 0,
        margin: 0,
      }}
    >
      {/* ---------------------------------------------------------------------------------------- ???????????? Layout ICon ??????????????????*/}
      <Layout />

      {/* ---------------------------------------------------------------------------------------- ???????????????????????? Navbar ??????????????????????????????????????????????????????????????????*/}
      <Navbar {...props} />
       {/* --------------------------------------------------------------------------------------- ????????????????????? Navbar ??????????????????????????????????????????????????????????????????*/}

      {/* ---------------------------------------------------------------------------------------- ??????????????????Text?????????????????????????????? Account*/}
      <Breadcrumbs aria-label="breadcrumb" style={{ paddingLeft: "12em" }}>
        <Text size={18}>??????????????????????????????????????????</Text>
      </Breadcrumbs>

      {/* ---------------------------------------------------------------------------------------- ???????????????????????? ????????????User ????????????????????? ?????????????????????*/}
      <Contents style={{ paddingLeft: "12em" }}>
        <Grid container justify={'space-between'}>
          {/* -------------------------------------------- Input ?????????????????????????????????????????? */}
          <Grid item xs={2}>
            <InputGroup>
              <InputField placeholder="???????????????" name={'search'} />
              <InputGroupAddon addonType="append">
                <InputGroupIcon>
                  <img width={20} src={'/asset/Magnifying.png'} />
                </InputGroupIcon>
              </InputGroupAddon>
            </InputGroup>
          </Grid>
          {/* -------------------------------------------- ???????????? ??????????????????????????????????????????????????????????????? */}
          <Grid item xs={2}>
            <FullWidthButton
              color="primary"
              onClick={() => {
                props.history.push('/account/add')
              }}
            >
              + ????????????????????????????????????
            </FullWidthButton>
          </Grid>
        </Grid>

        <Grid container justify={'center'}>
          {/* <ScrollingWrapper> */}
            
            {/* -------------------------------------------- Card ???????????????????????????????????? User ????????????????????? */}
            {/* <CardItem
              selected={selected === 'all'}
              onClick={() => {
                setSelected('all')
              }}
            >
              <Grid container justify={'center'}>
                <Text size={28}>User {users.length}</Text>
              </Grid>
              <Grid container justify={'center'}>
                <span>
                  <Text size={18}>?????????????????????</Text>
                </span>
              </Grid>
            </CardItem> */}
            

            {_.map(modelList, (item, n) => {
              console.log('number',n)
              return (
                // {/* -------------------------------------------- Card ????????????????????? ??????????????????????????????*/}
                <CardItem
                  selected={selected === n}
                  style={{
                    width:'370px',
                  }}
                  onClick={() => {
                    setSelected(n)
                  }}
                >
                  <Grid container>
                    <span>
                      <div
                        style={{
                          'overflow-y': 'auto',
                          width: '380px',
                          height: 150,
                        }}
                      >
                        <Text size={18} style={{fontWeight: "bold"}}>????????????????????? / ??????????????????</Text>

                        <Text size={16}> {item.name || item.projectName}</Text>
                        <br />
                        <Text size={16}>{item.projectOwner}</Text>
                      </div>
                    </span>
                  </Grid>
                  <Grid container justify={'flex-end'}>
                    <Text size={18}>
                      User {_.map(_.get(item, 'users', []), (item) => ({ ...item })).length}
                    </Text>
                  </Grid>
                </CardItem>
                
              )
            })}
          {/* </ScrollingWrapper> */}
        </Grid>

      </Contents>
    {/* ---------------------------------------------------------------------------------------- ????????????????????? ????????????User ????????????????????? ?????????????????????*/}

    {/* ---------------------------------------------------------------------------------------- ???????????????????????????????????????????????????????????????????????????????????? ??????????????????????????? SCurve ??????????????????????????????????????????????????????*/}
      {selected === 'all' ? (
        // <Table 
        //   style={{
        //     width: '100%',
        //     paddingLeft: "12em",
        //     paddingRight: "1.5em",
        //   }}
        //   columns={columns}
        //   dataSource={_.map(users, (item, index) => ({ ...item, id: index }))}
        // />
        <Contents 
          style={{
            width: '100%',
            height: '650px',
            backgroundColor:'#f3f3f3',
            paddingLeft: "12em",
            paddingRight: "1.5em",
          }}
        >
        </Contents>
      ) : (
        <>
          <Contents style={{ paddingLeft: "12em" }}>
            <Text size={18}>??????????????? S Curve</Text>

            {/* ---------------------------------------------------------------------------------------------????????????????????? API */}
            {/* <Grid container justify={'center'}>
              <Grid item xs={6}>
                <FormGroup row>
                  <Label for="exampleSelect" sm={3}>
                    ????????????????????? :
                  </Label>
                  <Col sm={6}>
                    <Input
                      type="file"
                      name="select"
                      id="exampleSelect"
                      onChange={(e) => {
                        //console.log(e.target.files[0])
                        setProjectFile(e.target.files[0])
                      }}
                      default={null}
                    ></Input>
                  </Col>
                  <Col sm={2}>
                    <FullWidthButton
                      color={'primary'}
                      onClick={() => {
                        if (projectFile) {
                          //console.log('Project File is', projectFile)

                          const storage = firebase.storage()
                          // /models/${modelList[selected].key}/users/${index}

                          const params = {
                            Body: projectFile,
                            Bucket: SPACES_NAME,
                            ACL: 'public-read',
                            Key: `models/${modelList[selected].key}/scurve.xlsx`,
                          }

                          s3.upload(params, (err, data) => {
                            if (err) {
                              throw err
                            }
                            alert('upload ??????????????????')

                            //console.log(`File uploaded successfully. ${data.Location}`)
                            firebase
                              .database()
                              .ref(`/models/${modelList[selected].key}/scurve`)
                              .set(data.Location)
                          })

                          // uploadTask.on(
                          //   'state_changed',
                          //   (snapshot) => {
                          //     // progress function ...
                          //     const progress = Math.round(
                          //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                          //     )
                          //     //console.log('Progress', progress)
                          //   },
                          //   (error) => {
                          //     // Error function ...
                          //     //console.log(error)
                          //   },
                          //   () => {
                          //     // complete function ...
                          //     storage
                          //       .ref(`/models/${modelList[selected].key}`)
                          //       .child('scurve.xlsx')
                          //       .getDownloadURL()
                          //       .then((url) => {
                          //         const bitly = new BitlyClient(
                          //           '7bf4dc32a4dca89da96a27c1fc705997a84c7f64'
                          //         )
                          //         bitly
                          //           .shorten(url)
                          //           .then(function (result) {
                          //             //console.log('Result file', result)
                          //             firebase
                          //               .database()
                          //               .ref(`/models/${modelList[selected].key}/scurve`)
                          //               .set(result.link)
                          //           })
                          //           .catch(function (error) {
                          //             console.error(error)
                          //           })
                          //       })
                          //   }
                          // )

                          setProjectFile(null)
                        } else {
                          //console.log('Please Select')
                          alert('??????????????????????????????')
                        }
                      }}
                    >
                      Save
                    </FullWidthButton>
                  </Col>
                </FormGroup>
              </Grid>
            </Grid> */}
            {/* ---------------------------------------------------------------------------------------------????????????????????? API */}

            {/* ------------------------------------------------------------------------------------------------------------- */}
            <Grid container justify={'center'}>
              <Grid item xs={6}>
                <FormGroup row>
                  <Label for="exampleSelect" sm={3}>
                    Link SCurve :
                  </Label>
                  <Col sm={6}>
                    <Input 
                    type="text" 
                    name="name"
                    id="exampleSelect"
                    placeholder="???????????????????????? Link ExcelSheet ?????????????????????????????????"
                    onChange={(e) => {
                      setForm({
                        ...memberForm,
                        uid: e.target.value,
                      })
                    }}
                    default={null}
                    >
                    </Input>
                    

                  </Col>
                  <Col sm={2}>
                    <FullWidthButton
                      color={'primary'}
                      onClick={() => {
                        if (memberForm.uid) {
                          // firebase.database().ref('/items')
                          {console.log('modelList',modelList[selected])}
                          {console.log('memberForm',memberForm)}
                          {console.log('memberForm.uid',memberForm.uid)}
                          {console.log('modelList.key',modelList[selected].key)}
                          {console.log('modelList.sc',modelList[selected].sc)}
                          
                          database.ref(`/models/${modelList[selected].key}`).update({sc:memberForm.uid});
                          alert('????????????????????????????????????????????????????????????????????????')
                          window.location='account'
   
                        } else {
                          //console.log('Please Select')
                          alert('?????????????????????????????????????????? Link')
                        }
                      }}
                    >
                      Save
                    </FullWidthButton>
                  </Col>
                </FormGroup>
              </Grid>
            </Grid>
            {/* ------------------------------------------------------------------------------------------------------------- */}

          </Contents>
          <Contents style={{ paddingLeft: "12em" }}>
            <Text size={18}>??????????????? User</Text>

            <Grid container justify={'center'}>
              <Grid item xs={6}>
                <FormGroup row>
                  <Label for="exampleSelect" sm={3}>
                    ?????????????????? :
                  </Label>
                  <Col sm={6}>
                    <Input
                      type="select"
                      name="select"
                      id="exampleSelect"
                      onChange={(e) => {
                        setForm({
                          ...memberForm,
                          uid: e.target.value,
                        })
                      }}
                      default={null}
                    >
                      <option value={'null'}>??????????????????????????????</option>

                      {users.map((item, index) => {
                        if (
                          _.find(
                            _.get(modelList[selected], 'users', []),
                            (modeluser) => modeluser.uid === item.uid
                          )
                        ) {
                          return ''
                        } else {
                          return (
                            <option key={`model1${index}`} value={item.uid}>
                              {`${item.firstName || ''} ${item.lastname || ''}`}
                            </option>
                          )
                        }
                      })}
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={3}>
                    ??????????????????????????????????????????????????????????????? :
                  </Label>
                  <Col sm={6}>
                    <Input
                      type="select"
                      name="select"
                      id="exampleSelect"
                      onChange={(e) => {
                        setForm({
                          ...memberForm,
                          level: e.target.value,
                        })
                      }}
                      default={null}
                    >
                      <option value={'null'}>??????????????????????????????</option>

                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleSelect" sm={3}>
                    ????????????????????? :
                  </Label>
                  <Col sm={6}>
                    <Input
                      type="select"
                      name="select"
                      id="exampleSelect"
                      onChange={(e) => {
                        setForm({
                          ...memberForm,
                          position: e.target.value,
                        })
                      }}
                      default={'???????????????'}
                    >
                      <option value={'???????????????'}>??????????????????????????????</option>
                      {_.get(modelList[selected], 'position', []).map((item, index) => (
                        <option key={`model1${index}`} value={item}>
                          {item}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col sm={2}>
                    <FullWidthButton
                      color={'primary'}
                      onClick={() => {
                        if (memberForm.uid) {
                          database.ref(`/models/${modelList[selected].key}/users`).push(memberForm)
                          setForm({})
                          alert('????????????????????????????????????????????????????????????????????????')
                        } else {
                          //console.log('Please Select')
                          alert('??????????????????????????????')
                        }
                      }}
                    >
                      ???????????????
                    </FullWidthButton>
                  </Col>
                </FormGroup>
              </Grid>
            </Grid>
          </Contents>
          {_.map(_.get(modelList[selected], 'users', []), (item, index) => {
            const user = _.find(users, (userData) => userData.uid === item.uid)
            return (
              <Contents style={{ paddingLeft: "12em" }}>
                <Grid container spacing={1}>
                  <Grid
                    xs={1}
                    style={{
                      padding: 10,
                    }}
                  >
                    <img src={'/user.png'} />
                  </Grid>
                  <Grid
                    xs={2}
                    style={{
                      padding: 10,
                    }}
                  >
                    {_.get(user, 'firstName', '')} {_.get(user, 'lastname', '')}
                  </Grid>
                  <Grid
                    xs={2}
                    style={{
                      padding: 10,
                    }}
                  >
                    {_.get(user, 'company', '')}
                  </Grid>
                  <Grid
                    xs={1}
                    style={{
                      padding: 10,
                    }}
                  >
                    ????????????????????? : {item.position || '???????????????'}
                  </Grid>
                  <Grid
                    xs={1}
                    style={{
                      padding: 10,
                    }}
                  >
                    <Input
                      type="select"
                      name="select"
                      id="exampleSelect"
                      onChange={(e) => {
                        setEditForm({
                          ...item,
                          position: e.target.value,
                        })
                      }}
                      default={'???????????????'}
                    >
                      <option value={'???????????????'}>??????????????????????????????</option>
                      {_.get(modelList[selected], 'position', []).map((position, index) => (
                        <option
                          key={`model1${index}`}
                          value={position}
                          selected={item.position === position}
                        >
                          {position}
                        </option>
                      ))}
                    </Input>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    style={{
                      padding: 10,
                    }}
                  >
                    <ButtonToggle
                      color={'primary'}
                      onClick={() => {
                        database
                          .ref(`/models/${modelList[selected].key}/users/${index}`)
                          .set({ ...item, ...memberEditForm })
                      }}
                    >
                      Update
                    </ButtonToggle>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    style={{
                      padding: 10,
                    }}
                  >
                    <a
                      style={{
                        color: 'red',
                      }}
                      onClick={() => {
                        database.ref(`/models/${modelList[selected].key}/users/${index}`).set(null)
                      }}
                    >
                      <DeleteIcon />
                    </a>
                  </Grid>
                </Grid>
              </Contents>
            )
          })}
        </>
      )}
{/* -----------------------------------------------------------------------------------------------------------  ????????????????????????????????????????????????????????????????????????????????? ??????????????????????????? SCurve ??????????????????????????????????????????????????????*/}

    </div>
  )
}
export default Account;
