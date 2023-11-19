import User from '../models/user'

class Challenges {
  challenges: { [key: string]: string } = {}

  createChallenge(publicKey: string) {
    const challenge = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    this.challenges[publicKey] = challenge

    // Remove the challenge after 2 minutes
    setTimeout(() => {
      delete this.challenges[publicKey]
    }, 120000)

    return challenge
  }

  async verifyChallenge(publicKey, signature, message) {
    if (!this.challenges[publicKey]) {
      return false
    }

    const user = await User.findOne({ publicKey })
    if (!user) {
      throw new Error('User not found')
    }

    // verify the challenge with secp verify
    const msg = Buffer.from(message, 'hex')
    const sig = Buffer.from(signature, 'hex')
    // const verified = secp.verify(msg, sig, publicKey)
    const verified = false

    return verified
  }
}

export default new Challenges()