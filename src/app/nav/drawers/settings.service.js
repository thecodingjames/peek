export default Vue.reactive({

  http: {
    followRedirect: true,
    setFollowRedirect(value) {
      this.followRedirect = !!value
    },
  }

})
