import React, {Component} from 'react'
import Relay from 'react-relay'
import {Location, MentorView, LeftWrapper, UpperMain, Rating, RatingVal, NumberRatings, InfoFeed, Text, MediaLinks, MediaItem,
RightPanel, Label, MissingMentorData, Summary, Reviews, ReviewLabel, CenteredRow, MentorHandle} from 'styled/MentorProfile'
import PinIcon from 'icons/Location'
import {BtAvatar, BtTagList} from 'styled'
import {ProjectListSm} from 'components/ProjectListSm'
import Edit from 'icons/Edit'
import {purple} from 'theme'
import {mapUserInfo} from 'utils/mapUserInfo'
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import {url} from 'config'
import Temp from 'icons/MentorTemp.png'
import ReactPlayer from 'react-player'
class MentorProfile extends Component {

  constructor(props) {
    super(props)
    let {Mentor} = this.props.viewer
    let mappedInfo = mapUserInfo(Mentor.userAccount, Mentor)
    console.log('profile user', Mentor);
    console.log('mentor props', props);
    this.state = {
      handle: Mentor.handle || '',
      placename: Mentor.userAccount.placename || '',
      summary: Mentor.summary || '',
      portraitUrl: (Mentor.userAccount.portrait || {}).url || `${url}/logo.png`,
      portraitSmallUrl: (Mentor.userAccount.portraitSmall || {}).url || `${url}/logo.png`,
      website: Mentor.website || '',
      specialties: Mentor.specialties || [],
      qualifications: Mentor.qualifications || [],
      reviews: Mentor.reviews || [],
      videoUrl: Mentor.videoUrl || '',
      occupation: Mentor.occupation || '',
      skills: mappedInfo.skills,
      influences: mappedInfo.influences,
      genres: mappedInfo.genres,
      mediaUrls: Mentor.mediaUrls,
      // projects: Mentor.projects.count,
      // friends: Mentor.friends.count,
      // notification: false,
      editProfile: false,
      editMusicianInfo: false,
    }
  }

  rateMentor = (rating) => {
    console.log({rating});
  }

  render(){
    let {Mentor, user} = this.props.viewer
    let ownProfile = Mentor.userAccount.id===user.id
    let { handle,
          specialties,
          occupation,
          qualifications,
          genres,
          influences,
          summary,
          reviews,
          mediaUrls,
          videoUrl,
          placename } = this.state
    return (
      <MentorView>
        <LeftWrapper>
          <UpperMain>
            {ownProfile && <Edit
              onClick={()=>this.props.router.push(`/mentor/editProfile/${user.handle}/`)}
              fill={purple}
              style={{
                alignSelf: 'flex-end',
                padding: '20px 20px 0 0',
                cursor: 'pointer',
                position: 'absolute'
              }}
            />}
            <CenteredRow>
              <BtAvatar size={150} hideStatus user={Mentor.userAccount} pointer={ownProfile}
                // onClick={()=>ownProfile && this.setState({imageEditorOpen: true})}
              />
              <MentorHandle>{handle}</MentorHandle>
              <Location>
                {(placename || ownProfile) &&
                  <PinIcon style={{marginRight: '4px'}} />}
                {placename}
                <MissingMentorData hide={placename || !ownProfile}
                  onClick={()=>this.setState({editProfile: true})}>
                  Add your location
                </MissingMentorData>
              </Location>
              <Rating>
                <Rater total={5} rating={3.5} onRate={()=>this.rateMentor()} interactive/>
                <RatingVal> 4.5 </RatingVal>
                <NumberRatings> ({reviews.count})</NumberRatings>
              </Rating>
            </CenteredRow>
            <Summary>{summary}</Summary>
          </UpperMain>
          <InfoFeed>

            {videoUrl && <ReactPlayer url={videoUrl} />}
            <Label hide={(!ownProfile && !specialties.length)} >
              SPECIALTIES
            </Label>
            <Text>{specialties.join(', ')}</Text>
            <Label hide={(!ownProfile && !occupation)} >
              CURRENT OCCUPATION
            </Label>
            <Text>{occupation}</Text>
            <Label hide={(!ownProfile && !qualifications.length)} >
              QUALIFICATIONS
            </Label>
            <Text>{qualifications[0]}</Text>
            <Label hide={(!ownProfile && !genres.length)} >
              GENRES
            </Label>
            {console.log('genres')}
            <BtTagList items={genres} />
            <Label hide={(!ownProfile && !influences.length)} >
              INFLUENCES
            </Label>
            <BtTagList items={influences} grayTag />
            <Label hide={(!ownProfile)} >
              MY WORK
            </Label>
            <div style={{margin: '0 -50px'}}>
              <ProjectListSm {...this.props} mentor/>
            </div>

            <MediaLinks urls={mediaUrls}>
              {/* {mediaUrls.map(edge => <MediaItem {...edge.node} />)} */}
              {/* <MediaItem type={'SOUND_CLOUD'} url={'soundcloud.com/holes-in-a-barrel'} />
              <MediaItem type={'YOU_TUBE'} url={'soundcloud.com/holes-in-a-barrel'}/> */}
            </MediaLinks>
            <Reviews>
              <ReviewLabel>User Reviews ({reviews.count})</ReviewLabel>
              {/* <ReviewList reviews={reviews} /> */}
            </Reviews>
          </InfoFeed>
        </LeftWrapper>
        <RightPanel>
          <img src={Temp} width={325} height={354} alt='temp'/>
        </RightPanel>
      </MentorView>
    )
  }
}


export default Relay.createContainer(MentorProfile, {
  initialVariables: {mentorHandle: '', projectsFilter: {}},
  prepareVariables: (urlParams) => {
    return {
      ...urlParams,
      //ensures non-deleted projects as well
      projectsFilter: {privacy_not: 'PRIVATE'},
    }
  },
  fragments: {
   viewer: () => Relay.QL`
     fragment on Viewer {
       user {
         id
         experience
         lastPing
         email
         handle
         summary
         website
         placename
         score
         portrait {
           id
           url
         }
         portraitSmall {
           id
           url
         }
         projects { count }
         friends (
           filter: {deactivated: false}
         ) { count }
         genres ( first: 40 ) {
           edges { node { id, name } }
         }
         skills ( first: 40 ) {
           edges {
             node {
               id
               name
             }
           }
         }
         artistInfluences ( first: 40 ) {
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
       Mentor (handle: $mentorHandle) {
         id
         handle
         summary
         videoUrl
         occupation
         qualifications
         specialties
         website
         deactivated
         mentees (first: 100) {
           count
           edges { node { id, handle } }
         }
         mediaUrls
         userAccount {
           id
           handle
           lastPing
           latitude
           longitude
           placename
           email
           portrait { url }
           portraitSmall { url }
           portraitMini { url }
           genres ( first: 40 ) {
             edges { node { id, name } }
           }
           artistInfluences ( first: 40 ) {
             edges {
               node {
                 id
                 name
                 spotifyId
                 imageUrl
               }
             }
           }
           projects (
             first: 5
             orderBy: createdAt_ASC
             filter: $projectsFilter
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
         }
         reviews (first: 100) {
           count
           edges { node { id, text, rating } }
       }
     }
   }
   `,
  }
})
