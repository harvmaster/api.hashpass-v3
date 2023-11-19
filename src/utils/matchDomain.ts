import axios from 'axios'

interface Domain {
  domain: string;
  name: string;
  logo: string;
}

export const matchDomain = async (name: string): Promise<Domain[]> => {
  try {
    const response = await axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${name}`)
    const { data } = response
    if (data && data.length > 0) {
      return data
    }
  } catch (err) {
    console.error(err)
  }
  return []
}

export default matchDomain