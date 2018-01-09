import React, {Component} from 'react'
import Relay from 'react-relay'
import {Location, MentorView, LeftWrapper, UpperMain, Rating, InfoFeed, Text, MediaLinks, MediaItem, RightPanel, Label, MissingMentorData, Summary, Reviews, CenteredRow, MentorHandle, ReserveUpper, ReserveLower,
  // RatingVal, NumberRatings, ReviewLabel,
} from 'styled/MentorProfile'
import PinIcon from 'icons/Location'
import {BtAvatar, BtTagList, BtFlatButton} from 'styled'
import {ProjectListSm} from 'components/ProjectListSm'
import Edit from 'icons/Edit'
import {purple, white} from 'theme'
import {mapUserInfo, mapMentorInfo} from 'utils/mapUserInfo'
// import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import {url} from 'config'
import AddToReservations from 'mutations/AddToReservations'
import RemoveFromReservations from 'mutations/RemoveFromReservations'
import ReactPlayer from 'react-player'
import {mapNodes} from 'utils/mapNodes'

class MentorProfile extends Component {

  constructor(props) {
    super(props)
    let {Mentor, user} = this.props.viewer
    let mappedUserInfo = mapUserInfo(Mentor.userAccount)
    console.log('mentor props', props);
    this.state = {
      handle: Mentor.handle || '',
      placename: Mentor.userAccount.placename || '',
      summary: Mentor.summary || '',
      portraitUrl: (Mentor.userAccount.portrait || {}).url || `${url}/logo.png`,
      portraitSmallUrl: (Mentor.userAccount.portraitSmall || {}).url || `${url}/logo.png`,
      website: Mentor.website || '',
      specialties: mapMentorInfo(Mentor).specialties || [],
      qualifications: Mentor.qualifications || [],
      reviews: Mentor.reviews || [],
      videoUrl: Mentor.videoUrl || '',
      occupation: Mentor.occupation || '',
      skills: mappedUserInfo.skills,
      influences: mappedUserInfo.influences,
      genres: mappedUserInfo.genres,
      mediaUrls: Mentor.mediaUrls,
      editProfile: false,
      editMusicianInfo: false,
      newReservation: false,
      isReserved: mapNodes(user.mentorReservations, '.id').includes(Mentor.id),
      playerHeight: 0
    }
  }

  componentDidMount() {
    this.updateDims()
    window.addEventListener("resize", this.updateDims);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDims);
  }

  updateDims = () => {
    this.setState({
      playerHeight: this.playerEl && (this.playerEl.wrapper.offsetWidth*9/16)
    })
  }

  rateMentor = (rating) => {
    console.log({rating})
  }

  handleReservation = () => {
    let mentorId = this.props.viewer.Mentor.id
    let menteeId = this.props.viewer.user.id
    if (this.state.isReserved) {
      this.props.relay.commitUpdate(
        new RemoveFromReservations({ mentorId, menteeId }), {
          onSuccess: res => {
            console.log('reservation removed', res);
            this.setState({isReserved: false, newReservation: false})
          },
          onFailure: res => {console.log('REMOVE Reservation FAILURE', res)}
        }
      )
    } else {
      this.props.relay.commitUpdate(
        new AddToReservations({ mentorId, menteeId }), {
          onSuccess: res => {
            console.log('reservation added', res);
            this.setState({isReserved: true, newReservation: true})
          },
          onFailure: res => {console.log('ADD Reservation FAILURE', res)}
        }
      )
    }
  }



  render(){
    // console.log('mentor state', this.state);
    let {Mentor, user} = this.props.viewer
    let ownProfile = Mentor.userAccount.id===user.id
    let { handle,
          specialties,
          occupation,
          qualifications,
          genres,
          influences,
          summary,
          // reviews,
          mediaUrls,
          videoUrl,
          newReservation,
          isReserved,
          placename } = this.state
    console.log('mp', this.state);
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
                {/* <Rater total={5} rating={4.5} onRate={()=>this.rateMentor()} interactive/>
                <RatingVal> 4.5 </RatingVal>
                <NumberRatings> ({reviews.count})</NumberRatings> */}
              </Rating>
            </CenteredRow>
            <Summary>{summary}</Summary>
          </UpperMain>
          <InfoFeed>
            {videoUrl &&
              <ReactPlayer
                ref={ref => {this.playerEl = ref}}
                width={'100%'}
                height={this.state.playerHeight}
                url={videoUrl} />
          }
            <Label hide={(!ownProfile && !specialties.length)} >
              SPECIALTIES
            </Label>
            <Text>{specialties.map(s => s.label).join(', ')}</Text>
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

            <MediaLinks>
              {(mediaUrls || []).map((url, i) => <MediaItem key={i} url={url} />)}
            </MediaLinks>
            <Reviews>
              {/* <ReviewLabel>User Reviews ({reviews.count})</ReviewLabel> */}
              {/* <ReviewList reviews={reviews} /> */}
            </Reviews>
          </InfoFeed>
        </LeftWrapper>
        <RightPanel hide={newReservation || ownProfile}>
          <ReserveUpper>
            {isReserved ? 'Your Spot Has Been Reserved'
              : 'Interested In This Mentor?'}
          </ReserveUpper>
          <BtFlatButton
            label={isReserved ? 'Cancel Reservation' : 'Reserve Your Spot'}
            onClick={()=>this.handleReservation()}
            labelStyle={{
              color: white,
              fontSize: '15px',
              fontWeight: '400'
            }}
            style={{width: '250px', height: '45px'}}
            backgroundColor={purple}
          />
          <ReserveLower>
            {isReserved ? 'You currently have a spot reserved'
              : 'Reserve your spot for free to get early access'}
          </ReserveLower>
        </RightPanel>
        <RightPanel hide={!newReservation || ownProfile}>
          <ReserveUpper>Spot Reserved!</ReserveUpper>
          <ReserveLower>
            You will be notified when this mentor is available
          </ReserveLower>
        </RightPanel>
      </MentorView>
    )
  }
}


export default Relay.createContainer(MentorProfile, {
  initialVariables: { mentorHandle: '', projectsFilter: {} },
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
         mentorReservations(first: 999) { edges { node { id } } }
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
         firstName
         lastName
         summary
         videoUrl
         occupation
         qualifications
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
                 edges { node {id} }
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
         specialties ( first: 20 ) {
           edges { node { id, name } }
         }
         website
         deactivated
         mentees (first: 100) {
           count
           edges { node { id, handle } }
         }
         mediaUrls
         packages (first: 10) {
           edges {
             node {
               responseHours
               reviewsPerMonth
               videoChatsPerMonth
               careerStrategizing
               mixingMasteringHelp
               introductionsToNetwork
               monthlyRate
             }
           }
         }
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
