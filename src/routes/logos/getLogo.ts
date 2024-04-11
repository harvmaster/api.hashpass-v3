import { Request, Response } from 'express';

import config from '../../../config';

import { LogoProps } from '../../models/logo';
import logoManager from '../../services/logoManager';

interface GetLogosRequestQuery {
  domain?: string;
  maxWidth?: number;
  data?: boolean;
}

/**
 * Gets logos for a given domain.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const getLogo = async (req: Request<any, any, any, GetLogosRequestQuery>, res: Response) => {
  try {
    // Get domain and maxWidth from query
    const { domain, data = false } = req.query;

    // Cap the maxWidth at 1024
    let { maxWidth } = req.query;
    if (maxWidth && maxWidth > 1024) maxWidth = 1024; 

    // Check if domain is provided
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Get logos. If there are no local logos, this will download and save them to the db
    let logos = await logoManager.getLogos(domain);
    if (!logos.length) {
      return res.status(404).json({ error: 'No logos found' });
    }

    // Filter logos by maxWidth and whether we can redirect to the original without cors issues
    const { redirect, local } = logos.reduce(
      (acc, logo) => {
        if (logo.redirect) {
          acc.redirect.push(logo);
        } else if (logo.size.width <= maxWidth) {
          acc.local.push(logo);
        }

        return acc;
      },
      { redirect: [] as LogoProps[], local: [] as LogoProps[] }
    );

    // If we have a redirectable logo, redirect to the largest one
    if (redirect.length) {
      if (data) {
        const remoteUrl = redirect.sort((a, b) => b.size.width - a.size.width)[0].original_url
        return res.redirect(remoteUrl);
      }
      const remoteImgs = redirect.map(({ original_url: src, size }) => ({ src, size }));
      return res.send(remoteImgs.sort((a, b) => b.size.width - a.size.width));
    }

    // If we have a local logo, return the largest one that fits within the maxWidth
    if (local.length) {
      const localImg = local.sort((a, b) => b.size.width - a.size.width)[0]
      if (data) {
        return res.setHeader('Content-Type', localImg.file.fileType).send(localImg.file.data)
      }

      const localImgUrl = `${config.baseUrl}/logos/${domain}?data=true`
      return res.send(localImgUrl);
    }

    // If we have no logos, return a 404
    return res.status(404).json({ error: 'No logos found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An internal server error occurred. Please try again later' });
  }
};

export default getLogo;