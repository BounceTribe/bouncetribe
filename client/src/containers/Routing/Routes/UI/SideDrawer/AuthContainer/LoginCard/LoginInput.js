import React from 'react'

const LoginInput = ({ disableField, input, label, type, meta: { touched, error, warning, visited, submitting } }) => {

  const visitedStylesLabel = () => {
    if (visited) {
      return {
        paddingBottom: '2em',
        color: 'black',
        fontSize: '.8em'
      }
    }
  }

  const visitedStylesInput = () => {
    if (visited) {
      return {
        height: '66%',
        paddingTop: '1em'
      }
    }
  }

  const visitedStylesCenterDiv = () => {
    if (visited) {
      return {
        width: '40%',
        height: '66%',
      }
    }
  }

  const visitedStylesSideDiv = () => {
    if (visited && error && touched) {
      return {
        height: '66%',
        width: '20%',
        borderColor: 'red',
      }
    }

    if (visited) {
      return {
        height: '66%',
        width: '20%',
        borderWidth: '2px'
      }
    }

  }
  const visitedStylesContainer = () => {
    if (visited) {
      return {
        paddingTop: '1em'
      }
    }
  }

  return (
      <div>
        <div
          style={{
            display: 'flex',
            height: '4em',
            width: '100%',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            zIndex: '-3',
            height: '4em',
            width: '100%',
            transition: 'padding .5s',
            ...visitedStylesContainer()
          }}
        >
          <div
            style={{
              display: 'flex',
              borderLeft: 'solid blue 5px',
              borderTop: 'solid blue 5px',
              borderBottom: 'solid blue 5px',
              width: '20%',
              height: '40%',
              transition: 'height .5s, width .5s, border-width .5s',
              ...visitedStylesSideDiv()
            }}
          >

          </div>
          <div
            style={{
              display: 'flex',
              width: '30%',
              height: '40%',
              transition: 'width .5s',
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'center',
              ...visitedStylesCenterDiv()
            }}
          >
          <div
            style={{
                display: 'flex',
                height: '25%',
                marginLeft: '2px'
            }}
          >
            {touched && ((error && <span style={{color: 'red', fontSize: '.4em'}}>{error}</span>) || (warning && <span style={{color: 'green'}}>{warning}</span>))}
          </div>
          </div>
          <div
            style={{
              display: 'flex',
              borderRight: 'solid blue 5px',
              borderTop: 'solid blue 5px',
              borderBottom: 'solid blue 5px',
              width: '20%',
              height: '40%',
              transition: 'height .5s, width .5s, border-width .5s',
              ...visitedStylesSideDiv()
            }}
          >

          </div>
        </div>
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              textAlign: 'center',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1em',
              zIndex: '-2',
              transition: 'padding .5s, color .5s, fontSize .5s',
              height: '4em',
              color: 'grey',
              ...visitedStylesLabel()
            }}
          >
            <span
            >
              {label}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              width:'100%',
              height: '33%',
              transition: 'height .5s, padding .5s',
              ...visitedStylesInput(),

            }}
          >
            <input
              style={{
                width:'100%',
                lineHeight: '100%',
                boxSizing: 'borderBox',
                fontSize: '1em',
                paddingLeft: '5px',
                backgroundColor: 'rgba(255, 255, 255, .0)',
                textAlign: 'center',
                border: '0',
                outline: 'none',
                color: 'grey'
              }}
              {...input}
              type={type}
              disabled={disableField}
            />
          </div>
        </div>
      </div>
    )
  }


export default LoginInput
