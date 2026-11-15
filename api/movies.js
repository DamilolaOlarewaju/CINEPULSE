// Server-side TMDB search, discovery, and recommendations.
// The TMDB_READ_ACCESS_TOKEN stays on Vercel and is never sent to browsers.
const GENRES = {
  28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',
  18:'Drama',10751:'Family',14:'Fantasy',36:'History',27:'Horror',10402:'Music',
  9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV Movie',53:'Thriller',
  10752:'War',37:'Western'
};
const FILTERS = {
  All:null,'Sci-Fi':878,Thriller:53,Drama:18,Horror:27,Crime:80,
  Fantasy:14,Action:28,Mystery:9648,Romance:10749,Animation:16
};
module.exports = async function handler(req,res) {
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  const token=process.env.TMDB_READ_ACCESS_TOKEN;
  if(!token)return res.status(503).json({error:'Movie API token is not configured'});
  const query=typeof req.query.q==='string'?req.query.q.trim().slice(0,100):'';
  const genre=typeof req.query.genre==='string'?req.query.genre:'All';
  const mode=req.query.mode==='recommend'?'recommend':'browse';
  const page=Math.min(100,Math.max(1,Number.parseInt(req.query.page,10)||1));
  try {
    let endpoint;
    const params=new URLSearchParams({language:'en-US',page:String(page),include_adult:'false'});
    if(query && mode!=='recommend'){
      endpoint='/search/movie';
      params.set('query',query);
    } else {
      endpoint='/discover/movie';
      params.set('sort_by',mode==='recommend'?'vote_average.desc':'popularity.desc');
      if(mode==='recommend') params.set('vote_count.gte','200');
      if(Object.prototype.hasOwnProperty.call(FILTERS,genre) && FILTERS[genre])params.set('with_genres',String(FILTERS[genre]));
    }
    const tmdb=await fetch('https://api.themoviedb.org/3'+endpoint+'?'+params.toString(),{
      headers:{Authorization:'Bearer '+token,Accept:'application/json'},
      signal:AbortSignal.timeout(10000)
    });
    if(!tmdb.ok)return res.status(502).json({error:'TMDB returned an error',upstreamStatus:tmdb.status});
    const data=await tmdb.json();
    const results=(data.results||[]).filter(m=>m.id&&m.title&&!m.adult).map(m=>({
      trackId:m.id,trackName:m.title,kind:'feature-movie',
      artworkUrl100:m.poster_path?'https://image.tmdb.org/t/p/w500'+m.poster_path:null,
      releaseDate:m.release_date||'',
      voteAverage:Number(m.vote_average)||0,
      voteCount:Number(m.vote_count)||0,
      trackTimeMillis:null,
      genres:(m.genre_ids||[]).map(id=>GENRES[id]).filter(Boolean),
      primaryGenreName:GENRES[(m.genre_ids||[])[0]]||'Movie',
      longDescription:m.overview||'',
      artistName:'Not listed',
      trackViewUrl:'https://www.themoviedb.org/movie/'+m.id
    }));
    res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=300');
    return res.status(200).json({resultCount:results.length,results,
      page:Number(data.page)||page,totalPages:Math.min(100,Number(data.total_pages)||1),source:'TMDB'});
  } catch(err){
    console.error('TMDB request failed',err&&err.message);
    return res.status(502).json({error:'Could not reach movie catalogue. Try again.'});
  }
};
