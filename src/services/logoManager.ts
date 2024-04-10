import axios from 'axios';

import Logo, { LogoProps } from '../models/logo';

/**
 * An interface for the response from the favicon scraper API.
 */
type FaviconScraperResponse = Favicon[]

type Favicon = {
  src: string;
  size: {
    width: number;
    height: number;
  };
}

/**
 * An interface for a downloaded logo.
 */
interface DownloadedLogo {
  src: string;
  size: {
    width: number;
    height: number;
  };
  data: ArrayBuffer;
}

/**
 * A class for managing logos.
 */
class LogoManager {
  /**
   * Gets logos for a given domain.
   * @param domain The domain to get logos for.
   * @returns A promise that resolves to an array of logo JSON data.
   */
  async getLogos(domain: string): Promise<LogoProps[]> {
    try {
      const logos = await Logo.find({ domain: domain, archived: false })
      if (!logos.length) {
        return this.downloadLogos(domain)
      }

      return logos.map(logo => logo.toJSONData())
    } catch (err) {
      // Handle any errors that occur during the database query.
      console.error(err);
      throw err;
    }
  }

  /**
   * Downloads logos for a given domain.
   * @param domain The domain to download logos for.
   * @returns A promise that resolves to an array of logo JSON data.
   */
  async downloadLogos(domain: string): Promise<LogoProps[]> {
    const { data } = await axios.get<FaviconScraperResponse>(`https://api.faviconscraper.mc.hzuccon.com/icon?url=${domain}`)

    /**
     * Downloads an image from a given URL and returns its data.
     * @param url The URL to download the image from.
     * @returns A promise that resolves to an array buffer containing the image data.
     */
    const downloadImage = async (url: string): Promise<ArrayBuffer> => {
      const { data } = await axios.get(url, { responseType: 'arraybuffer' })
      return data;
    }

    /**
     * Downloads multiple images in parallel and returns their data.
     * @param urls An array of image URLs to download.
     * @returns A promise that resolves to an array of objects containing the image data.
     */
    const downloadImages = async (images: FaviconScraperResponse): Promise<DownloadedLogo[]> => {
      return Promise.all(images.map(async (image): Promise<DownloadedLogo> => {
        const data = await downloadImage(image.src);
        return { ...image, data };
      }));
    }

    const images = await downloadImages(data);

    const savedImages = await Promise.all(images.map(image => this.saveLogo(domain, image)));

    return savedImages;
  }

  /**
   * Saves a logo to the database.
   * @param domain The domain of the logo.
   * @param logo The logo data.
   * @returns A promise that resolves to the logo JSON data.
   */
  async saveLogo(domain: string, logo: DownloadedLogo): Promise<LogoProps> {
    try {
      const newLogo = new Logo({
        domain,
        original_url: logo.src,
        size: logo.size,
        redirect: true,
        file: {
          data: Buffer.from(logo.data),
          fileType: 'image/png'
        },
        archived: false
      })

      const savedLogo = await newLogo.save();
      return savedLogo.toJSONData();
    } catch (err) {
      // Handle any errors that occur during the save operation.
      console.error(err);
      throw err;
    }
  }

  /**
   * Updates logos in batches.
   */
  // async batchUpdateLogos() {
  //   setInterval(async () => {
  //     let logos = await Logo.find({});
  //     logos = logos.filter(logo => logo.lastUpdated > 1000*60*60*24);
  //     logos.forEach(updateLogo);
  //   }, 1000 * 60 * 60); // Update every hour.
  // }
}

/**
 * The logo manager instance.
 */
const logoManager = new LogoManager();

export default logoManager;