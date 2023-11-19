import axios from 'axios'

export const getLogo = async (domain: string): Promise<string> => {
  try {
    const response = await axios.get(`https://api.faviconscraper.mc.hzuccon.com/icon?url=${domain}`)
    const { data } = response
    if (data) {
      return data
    }
  } catch (err) {
    console.error(err)
  }
  return ''
}

export default getLogo