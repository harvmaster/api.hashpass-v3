import fs from 'fs'

interface LogoCacheEntry {
  icons: IconEntry[];
}

interface IconEntry {
  url: string;
  size: {
    width: number;
    height: number;
  };
  file: string;
  redirect: boolean
}

class LogoCache {
  private static instance?: LogoCache 
  private cache = new Map<string, LogoCacheEntry>();

  constructor () {
    
  }

  async init () {
    console.log('Starting Logo Cache')
    // Load cache from disk
    // const cache = fs.readFileSync('cache.json', 'utf8');
    // this.cache = new Map(JSON.parse(cache));
    const iconFiles = await fs.promises.readdir('src/public/icons')
    const iconCache = new Map<string, string>()
    console.log(iconFiles)
  }

  has
}

const logoCache = new LogoCache()

export default logoCache