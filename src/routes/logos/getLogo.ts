import { Request, Response } from 'express';
import axios from 'axios';

interface FaviconScraperResponse {
  icons: {
    src: string;
    size: {
      width: number;
      height: number;
    };
  }[]
}

export const getLogos = async (req: Request, res: Response) => {
  try {
    const { domain } = req.query
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' })
    }

    const { data } = await axios.get<FaviconScraperResponse>(`https://api.faviconscraper.mc.hzuccon.com/icon?url=${domain}`)
    console.log(data)

    return res.status(200).json({ logo: data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'An internal server error occurred. Please try again later' })
  }
}

export default getLogos