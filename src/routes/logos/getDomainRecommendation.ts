import { Request, Response } from 'express'
import axios from 'axios'

type ClearbitAutocompleteResponse = ClearbitAutocompleteItem[]

interface ClearbitAutocompleteItem {
  name: string
  domain: string
  logo: string
}

export const getDomainRecommendation = async (req: Request, res: Response) => {
  try {
    const { domain } = req.query
    console.log(domain)
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' })
    }

    const { data } = await axios.get<ClearbitAutocompleteResponse>(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${domain}`)
    console.log(data)
    
    return res.status(200).json({ domains: data.map((d: ClearbitAutocompleteItem) => d.domain) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'An internal server error occurred. Please try again later' })
  }
}

export default getDomainRecommendation