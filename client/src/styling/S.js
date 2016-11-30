const defaultConfig = {
  base: {},
  mobile: {}
}

class S {
  constructor(configObject = defaultConfig) {
    this.baseStyles = configObject.base || defaultConfig.base
    this.mobileStyles = configObject.mobile || defaultConfig.mobile
  }


  get base() {
    return {
      ...this.baseStyles,
    }
  }

  get mobile() {
    return {
      ...this.mobileStyles,
    }
  }

  get all() {

    if (window.innerWidth < 800) {
      return {
        ...this.base,
        ...this.mobile
      }
    } else {
      return {
        ...this.base,
      }
    }
  }
}

export default S
