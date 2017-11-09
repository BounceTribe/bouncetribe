import React from 'react'
import styled from 'styled-components'
import {PanelScrollContainer} from 'styled'
import {ProjectItemSm} from 'components/ProjectItemSm'

export const ProjectsContainerSm = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
`

// const Spacer = styled.div`
//   ${'' /* overflow-y: scroll; */}
//   &:after {
//     content: "";
//     display: block;
//     height: 15px;
//     width: 100%;
//   }
// `
const edgeFilter = (project, type) => (
  project.comments.edges.filter( (edge) => edge.node.type === type)
)

const makeList = (props) => {
  let bounceTab = props.location.pathname.match(/\/bounces$/)
  let User = props.viewer.User
  let edges = bounceTab ? User.bounces.edges : User.projects.edges
  return edges.map((edge, index) => {
    let project = edge.node.project || edge.node
    if (project.privacy === 'PRIVATE') {
      return null
    } else {
      let comments = edgeFilter(project, 'COMMENT')
      let likes = edgeFilter(project, 'LIKE')
      let bounces = project.bounces.edges.map(edge => edge.node)
      return (
        <ProjectItemSm
          key={project.id + index}
          User={User}
          project={project}
          comments={comments}
          likes={likes}
          bounces={bounces}
          bounceTab={bounceTab}
         />
      )
    }
  } )
}

export const ProjectListSm = (props) => {
  return (
    <PanelScrollContainer>
      <ProjectsContainerSm >
        {makeList(props)}
      </ProjectsContainerSm>
    </PanelScrollContainer>
  )
}
