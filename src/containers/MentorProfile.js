import React, {Component} from 'react'
import Relay from 'react-relay'
import {Location, MentorView, LeftWrapper, UpperMain, Rating, RatingVal, NumberRatings, InfoFeed, Text, MediaLinls, MediaItem,
RightPanel, Label, MissingMentorData, Summary} from 'styled/MentorProfile'
import PinIcon from 'icons/Location'
import {BtAvatar, BtTagList} from 'styled'
import {ProjectListSm} from 'components/ProjectListSm'
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'

class MentorProfile extends Component {

  constructor(props) {
    super()
    this.User = props.viewer.User
  }

  rateMentor = (rating) => {
    console.log({rating});
  }

  render(){
    let {User, mentor, user} = this.props.viewer
    let ownProfile = User.id===user.id
    let { specialties,
          occupation,
          qualifications,
          genres,
          influences,
          projects,
          mediaLinks } = mentor
    return (
      <MentorView>
        <LeftWrapper>
          <UpperMain>
            <BtAvatar size={150} hideStatus user={User} pointer={ownProfile}
              // onClick={()=>ownProfile && this.setState({imageEditorOpen: true})}
            />
            <Location>
              {(User.placename || ownProfile) &&
                <PinIcon style={{marginRight: '8px'}} />}
              {User.placename}
              <MissingMentorData hide={User.placename || !ownProfile}
                onClick={()=>{this.setState({editProfile: true})}}>
                Add your location
              </MissingMentorData>
            </Location>
            <Rating>
              <Rater total={5} rating={4.5} onRate={this.rateMentor} interactive/>
              <RatingVal></RatingVal>
              <NumberRatings></NumberRatings>
            </Rating>
            <Summary>{this.user.summary}</Summary>
          </UpperMain>
          <InfoFeed>

            <Label hide={(!ownProfile && !specialties.length)} >
              SPECIALTIES
            </Label>
            <Text>{specialties.join(', ')}</Text>
            <Label hide={(!ownProfile && !occupation)} >
              CURRENT OCCUPATION
            </Label>
            <Text>
            </Text>
            <Label hide={(!ownProfile && !qualifications.length)} >
              QUALIFICATIONS
            </Label>
            <Text>{qualifications.join(', ')}</Text>
            <Label hide={(!ownProfile && !genres.length)} >
              GENRES
            </Label>
            <BtTagList items={genres} />
            <Label hide={(!ownProfile && !influences.length)} >
              INFLUENCES
            </Label>
            <BtTagList items={influences} grayTag />

            <Label hide={(!ownProfile && !projects.count)} >
              MY WORK
            </Label>

            <ProjectListSm {...this.props} />

            <MediaLinls>
              {mediaLinks.map(item => <MediaItem {...item} />)}
            </MediaLinls>
            {/* <Reviews>
              <ReviewLabel>User Reviews ({reviews.count})</ReviewLabel>
              <ReviewList reviews={reviews} />
            </Reviews> */}
          </InfoFeed>

        </LeftWrapper>
        <RightPanel>

        </RightPanel>
      </MentorView>
    )
  }

}


export default Relay.createContainer(
MentorProfile, {
initialVariables: {
 theirHandle: ''
},
fragments: {
 viewer: () => Relay.QL`
   fragment on Viewer {
     user {
       id
       handle
     }
     User (handle: $theirHandle) {
       id
       experience
       lastPing
       email
       handle
       summary
       portrait {
         id
         url
       }
       portraitSmall {
         id
         url
       }
       website
       placename
       score
       projects (
         first: 10
         orderBy: createdAt_ASC
         # filter: $projectsFilter
       ){
         count
         edges {
           node {
             id
             title
             createdAt
             bounces (first:999) {
               edges {
                 node {id}
               }
             }
             artwork { url }
             artworkSmall { url }
             privacy
             creator {handle}
             comments ( first: 999 ) {
               edges {
                 node { type }
               }
             }
           }
         }
       }
       friends (
         filter: {deactivated: false}
       ) { count }
       genres ( first: 20 ) {
         edges {
           node {
             id
             name
           }
         }
       }
       skills ( first: 20 ) {
         edges {
           node {
             id
             name
           }
         }
       }
       artistInfluences ( first: 20 ) {
         edges {
           node {
             id
             name
             spotifyId
             imageUrl
           }
         }
       }
     }
   }
 `,
}
}
)
