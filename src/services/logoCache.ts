import fs from 'fs'

class logoCache {
  private cache = new Map<string, string>();

  constructor () {
    // Load cache from disk
    const cache = fs.readFileSync('cache.json', 'utf8');
    this.cache = new Map(JSON.parse(cache));

    const iconFiles = fs.readdirSync('../public/icons')
    console.log(iconFiles)
  }
}