import React, { Component } from 'react'
import Relay from 'react-relay'
import styled from 'styled-components'
import {btBlack, btLight} from 'styling/T'
import {Link} from 'react-router'
import BTButton from 'reusables/BTButton'
import Notes from 'imgs/icons/notes'
import Upload from 'imgs/icons/Upload'
import CreateProjectMutation from 'mutations/CreateProjectMutation'
import ProjectListItem from 'reusables/ProjectListItem'

const TribeHeader = styled.ul`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  margin: 0 1.2%;
  box-sizing: border-box;
`

// const Search = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-content: center;
//   justify-content: flex-start;
//   align-items: center;
//   margin: 0 1.2%;
//   box-sizing: border-box;
// `

const TribeHeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: baseline;
`

// const TribeList = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-content: flex-start;
//   justify-content: flex-start;
//   align-items: baseline;
//   flex-wrap: wrap;
//
// `

const TribeHeaderText = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-content: flex-end;
  align-items: baseline;
`

const MyTribeText = styled.h2`
  color: ${props=> props.active ? btBlack : btLight };
  font-weight: ${props=> props.active ? '400' : '200' };
`


const IconContainer = styled.div`
  display: flex;
  align-content: flex-end;
  margin-right: 5px;
  height: 25px;
  width: 25px;
`

const TribeList = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: baseline;
`


class ProjectsContainer extends Component {

  createProject = async () => {
    let {
      router,
      user
    } = this.props
    let hash = Math.random().toString(36).substring(7)
    let title = 'untitled' + hash
    let project = {
      title,
    }
    Relay.Store.commitUpdate(
      new CreateProjectMutation({
        user: this.props.user,
        project
      }), {
        onSuccess: (result) => {
          router.push({
            pathname: `/${user.handle}/projects/${title}`
          })
        }
      }
    )
  }

   get showProjectList () {
    return this.props.user.projects.edges.map((edge) => {
      return (
        <ProjectListItem
          key={edge.node.id}
          project={edge.node}
          user={this.props.user}
        />
      )
    })
  }

  render() {
    let {
      router
    } = this.props
    return (
      <div>

                <TribeHeader>
                    <Link
                      to={`/${router.params.handle}/projects`}
                    >
                      <TribeHeaderText>
                        <IconContainer>
                          <Notes/>
                        </IconContainer>
                        <MyTribeText
                          active={(router.location.pathname === `/${router.params.handle}/projects`)}
                        >
                          My Projects
                        </MyTribeText>
                    </TribeHeaderText>
                    </Link>
                  <TribeHeaderRight>


                      <Link
                        onClick={this.createProject}
                      >
                        <BTButton
                          text={'New Project'}
                          flex
                          icon={Upload}
                        />
                      </Link>
                  </TribeHeaderRight>


                </TribeHeader>

                <TribeList>
                  {this.showProjectList}
                </TribeList>
      </div>
    )
  }
}

export default Relay.createContainer(
  ProjectsContainer,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          placename
          longitude
          latitude
          website
          experience
          email
          name
          profilePicUrl
          profilePicThumb
          handle
          summary
          projects (first: 2147483647) {
            edges {
              node {
                title
                id
                artwork {
                  url
                }
              }
            }
          }
          id
        }
      `,
    },
  }
)
