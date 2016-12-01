import React from 'react'

const signupInput = ({ disableField, input, label, type, meta: { touched, error, warning } }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '15px'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <label>{label}</label>
        {touched && ((error && <span style={{color: 'red'}}>{error}</span>) || (warning && <span style={{color: 'green'}}>{warning}</span>))}
      </div>
      <input
        {...input}
        placeholder={label}
        type={type}
        style={{
          width: '100%'
        }}
        disabled={disableField}
      />
    </div>
  )
}

export default signupInput
