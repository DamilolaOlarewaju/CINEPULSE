// Vercel serverless endpoint. Keep TMDB_READ_ACCESS_TOKEN in Vercel Environment Variables.
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) return res.status(503).json({ error: 'TMDB_READ_ACCESS_TOKEN is not configured on the server' });
  try {
    const response = await fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', {
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return res.status(502).json({ error: 'TMDB request failed', status: response.status });
    const data = await response.json();
    const genres = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV Movie',53:'Thriller',10752:'War',37:'Western'};
    const results = (data.results || []).filter(m => m.id && m.title && m.poster_path && !m.adult).slice(0,12).map(m => ({
      trackId: m.id,
      trackName: m.title,
      kind: 'feature-movie',
      artworkUrl100: 'https://image.tmdb.org/t/p/w500' + m.poster_path,
      releaseDate: m.release_date || '',
      voteAverage: Number(m.vote_average) || 0,
      trackTimeMillis: null,
      primaryGenreName: genres[(m.genre_ids||[])[0]] || 'Movie',
      longDescription: m.overview || '',
      artistName: 'Not listed',
      trackViewUrl: 'https://www.themoviedb.org/movie/' + m.id
    }));
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');
    return res.status(200).json({ resultCount: results.length, results, source:'TMDB' });
  } catch (e) {
    return res.status(502).json({ error: 'Unable to retrieve movie catalogue' });
  }
};
