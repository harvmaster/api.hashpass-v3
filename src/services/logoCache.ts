import axios from 'axios';

import Logo, { LogoProps } from '../models/logo'

interface FaviconScraperResponse {
  icons: {
    src: string;
    size: {
      width: number;
      height: number;
    };
  }[]
}

interface DownloadedLogo {
  src: string;
  size: {
    width: number;
    height: number;
  };
  data: ArrayBuffer;
}

class LogoManager {
  async getLogos(domain: string): Promise<LogoProps[]> {
    const logos = await Logo.find({ domain: domain })
    if (!logos.length) {
      return this.downloadLogos(domain)
    }

    return logos.map(logo => logo.toJSONData())
  }

  async downloadLogos (domain: string): Promise<LogoProps[]> {
    const { data } = await axios.get<FaviconScraperResponse>(`https://api.faviconscraper.mc.hzuccon.com/icon?url=${domain}`)

    const imagePromises = data.icons.map(async (icon): Promise<DownloadedLogo> => {
      const { data: imageRes } = await axios.get(icon.src, { responseType: 'arraybuffer' })
      return { ...icon, data: imageRes.data } as DownloadedLogo
    })

    const images = await Promise.all(imagePromises)
    const savedImages = await Promise.all(images.map(image => this.saveLogo(domain, image)))

    return savedImages
  }

  async saveLogo (domain: string, logo: DownloadedLogo): Promise<LogoProps> {
    const newLogo = new Logo({
      domain,
      original_url: logo.src,
      size: logo.size,
      redirect: true,
      file: {
        data: Buffer.from(logo.data),
        type: 'image/png'
      }
    })

    await newLogo.save()
    return newLogo.toJSONData()
  }

  // async batchUpdateLogos () {
  //   setInterval(async () => {
  //     let logos = await Logo.find({})
  //     logos = logos.filter(logo => logo.lastUpdated > 1000*60*60*24)
  //     logos.forEach(updateLogo)
  //   })
  // }

}

const logoManager = new LogoManager()

export default logoManager