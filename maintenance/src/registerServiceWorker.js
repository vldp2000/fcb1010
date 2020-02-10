/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      this.$log.debug(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      this.$log.debug('Service worker has been registered.')
    },
    cached () {
      this.$log.debug('Content has been cached for offline use.')
    },
    updatefound () {
      this.$log.debug('New content is downloading.')
    },
    updated () {
      this.$log.debug('New content is available; please refresh.')
    },
    offline () {
      this.$log.debug('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
