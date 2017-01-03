import React, { Component } from 'react'
import Relay from 'react-relay'
import styled from 'styled-components'
import {btPurple, btMedium} from 'styling/T'
import cat from 'styling/burritocat.png'
import {Link} from 'react-router'

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  height: auto;
`

const FeedItem = styled.div`
  width: 100%;
  height: 700px;
  display: flex;
  flex-direction: column;
`

const FeedProfile = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 20px;
`

const CreatorThumb = styled.img`
  height: 50px;
  border-radius: 50px;
  display: flex;
`

const ProfileColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`

const ProjectTitle = styled.h3`
  color: ${btPurple};
`

const ProjectCreator = styled.span`
  color: ${btMedium};
`

const ProjectArt = styled.img`
  width: 100%
`

class FeedContainer extends Component {

  projects = () => {
    let projectArray = []
    this.props.user.friends.edges.forEach((edge)=> {
      edge.node.projects.edges.forEach((edge)=>{
        projectArray.push(edge.node)
      })
    })
    return projectArray
  }


  feedList = () => {
    console.log(this.projects())
    return this.projects().map(project=>{
      return (
        <FeedItem
          key={project.id}
        >
          <FeedProfile>
            <Link
              to={`/${project.creator.handle}/${project.title}`}
            >
            <CreatorThumb
              src={project.creator.profilePicThumb || project.creator.profilePicUrl}
            />
          </Link>
            <ProfileColumn>
              <Link
                to={`/${project.creator.handle}/${project.title}`}
              >
                <ProjectTitle>
                  {project.title}
                </ProjectTitle>
              </Link>

              <ProjectCreator>
                {project.creator.handle}
              </ProjectCreator>

            </ProfileColumn>
          </FeedProfile>
          <ProjectArt
            src={cat}
          />
        </FeedItem>
      )
    })


  }

  render() {
    console.log(this.props.user)
    return (
      <FeedList>
        {this.feedList()}
      </FeedList>
    )
  }
}

export default Relay.createContainer(
  FeedContainer,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          friends (
            first: 2147483647
            orderBy: updatedAt_ASC

          ) {
            edges {
              node {
                projects (
                  first: 2
                  orderBy: updatedAt_ASC
                  filter: {
                    privacy_not: PRIVATE
                  }
                ) {
                  edges {
                    node {
                      id
                      title
                      artwork {
                        url
                      }
                      creator {
                        handle
                        profilePicUrl
                        profilePicThumb
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    },
  }
)
