const truncateText = ({text, maxLines, maxChars}) => {
  //get OS-specific line break character type
  let newLine =
    (text.includes('\r\n') && '\r\n') ||
    (text.includes('\r') && '\r') ||
    '\n' //default

  let shortText = text
    .split(newLine, maxLines) //seperate by line
    .join(newLine) //reassemble to max # of lines
    .slice(0, maxChars) //cut to max # of chars

  return (shortText.length < text.length) ? shortText : null
}

export default truncateText
