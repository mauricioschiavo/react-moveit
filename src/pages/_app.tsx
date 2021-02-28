import '../styles/style.min.css'

import { ChallengesContext, ChalllengesProvider } from '../contexts/ChallengesContext'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

  return (
    <Component {...pageProps} />
  )
}

export default MyApp