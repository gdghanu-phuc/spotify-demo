(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const p of n.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&e(p)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function e(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const Z=window.fetch;let j=null,M=!1;const rt=window.location.pathname.split("/"),ot=()=>{if(window.location.hostname.includes("github.io")){const t=rt[1];return t?`/${t}`:""}return""},tt=ot();function et(t){if(!t)return"";if(t.startsWith("http://")||t.startsWith("https://")||t.startsWith("data:"))return t;const i=t.startsWith("/")?t:"/"+t;return`${tt}${i}`}function E(t){if(!t)return t;if(typeof t=="string")return t.startsWith("/uploads/")?et(t):t;if(Array.isArray(t))return t.map(i=>E(i));if(typeof t=="object"){const i={};for(const a in t)i[a]=E(t[a]);return i}return t}async function lt(){if(window.location.hostname.includes("github.io")){M=!0,console.log("[API Mode] GitHub Pages detected. Using LocalStorage Mock API.");return}try{(await Z("/api/health")).ok?(M=!1,console.log("[API Mode] Backend connected. Using live API.")):(M=!0,console.log("[API Mode] Backend responded with error. Falling back to LocalStorage Mock API."))}catch{M=!0,console.log("[API Mode] Backend unreachable. Falling back to LocalStorage Mock API.")}}function dt(){return j||(j=lt()),j}const G=[{id:1,name:"The Chillwaves",bio:"Cool and relaxing ambient vibes for study and relaxation.",image_url:"/uploads/images/the_chillwaves.svg"},{id:2,name:"Syntax Error",bio:"Energetic synthwave and techno tracks made by coders, for coders.",image_url:"/uploads/images/syntax_error.svg"},{id:3,name:"Midnight Beats",bio:"Lofi, jazz hop, and downtempo rhythms for late-night thoughts.",image_url:"/uploads/images/midnight_beats.svg"},{id:4,name:"MCK",bio:"Talented Vietnamese rapper and songwriter, known for his versatile style and raw storytelling.",image_url:"/uploads/images/mck.svg"}],J=[{id:1,title:"Ocean Breeze",cover_url:"/uploads/images/ocean_breeze.svg",artist_id:1,artist_name:"The Chillwaves",release_year:2024},{id:2,title:"Dark Mode",cover_url:"/uploads/images/dark_mode.svg",artist_id:2,artist_name:"Syntax Error",release_year:2023},{id:3,title:"Neon City",cover_url:"/uploads/images/neon_city.svg",artist_id:3,artist_name:"Midnight Beats",release_year:2025},{id:4,title:"HVL",cover_url:"/uploads/images/hvl.svg",artist_id:4,artist_name:"MCK",release_year:2026}],W=[{id:1,title:"Lost in the Waves",duration:180,song_url:"/uploads/audio/lost_in_the_waves.mp3",album_id:1,album_title:"Ocean Breeze",artist_id:1,artist_name:"The Chillwaves",cover_url:"/uploads/images/ocean_breeze.svg"},{id:2,title:"Summer Lounge",duration:210,song_url:"/uploads/audio/summer_lounge.mp3",album_id:1,album_title:"Ocean Breeze",artist_id:1,artist_name:"The Chillwaves",cover_url:"/uploads/images/ocean_breeze.svg"},{id:3,title:"Compile Success",duration:150,song_url:"/uploads/audio/compile_success.mp3",album_id:2,album_title:"Dark Mode",artist_id:2,artist_name:"Syntax Error",cover_url:"/uploads/images/dark_mode.svg"},{id:4,title:"Infinite Loop",duration:240,song_url:"/uploads/audio/infinite_loop.mp3",album_id:2,album_title:"Dark Mode",artist_id:2,artist_name:"Syntax Error",cover_url:"/uploads/images/dark_mode.svg"},{id:5,title:"Traffic Lights",duration:195,song_url:"/uploads/audio/traffic_lights.mp3",album_id:3,album_title:"Neon City",artist_id:3,artist_name:"Midnight Beats",cover_url:"/uploads/images/neon_city.svg"},{id:6,title:"Rainy Streets",duration:220,song_url:"/uploads/audio/rainy_streets.mp3",album_id:3,album_title:"Neon City",artist_id:3,artist_name:"Midnight Beats",cover_url:"/uploads/images/neon_city.svg"},{id:7,title:"Elegie",duration:120,song_url:"/uploads/audio/lost_in_the_waves.mp3",album_id:4,album_title:"HVL",artist_id:4,artist_name:"MCK",cover_url:"/uploads/images/hvl.svg"},{id:8,title:"CHEPHU",duration:195,song_url:"/uploads/audio/infinite_loop.mp3",album_id:4,album_title:"HVL",artist_id:4,artist_name:"MCK",cover_url:"/uploads/images/hvl.svg"},{id:9,title:"Oanh M = Thuoc",duration:180,song_url:"/uploads/audio/compile_success.mp3",album_id:4,album_title:"HVL",artist_id:4,artist_name:"MCK",cover_url:"/uploads/images/hvl.svg"},{id:10,title:"XAXOI",duration:215,song_url:"/uploads/audio/summer_lounge.mp3",album_id:4,album_title:"HVL",artist_id:4,artist_name:"MCK",cover_url:"/uploads/images/hvl.svg"},{id:11,title:"CAMON",duration:240,song_url:"/uploads/audio/traffic_lights.mp3",album_id:4,album_title:"HVL",artist_id:4,artist_name:"MCK",cover_url:"/uploads/images/hvl.svg"}];let f=null;function ct(){if(f)return;const t=localStorage.getItem("spotify_clone_mock_db");if(t){f=JSON.parse(t);let i=!1;G.forEach(a=>{f.artists.some(e=>e.id===a.id)||(f.artists.push(a),i=!0)}),J.forEach(a=>{f.albums.some(e=>e.id===a.id)||(f.albums.push(a),i=!0)}),W.forEach(a=>{f.songs.some(e=>e.id===a.id)||(f.songs.push(a),i=!0)}),i&&P()}else f={users:[{id:1,username:"demo",email:"demo@demo.com",password:"password123"}],artists:G,albums:J,songs:W,likedSongs:{demo:[1,3,5]},playlists:[{id:101,name:"Chill Vibes Mix",description:"A selection of the finest relaxing beats.",owner:"demo",cover_url:"/uploads/images/ocean_breeze.svg",song_ids:[1,2,5]}]},P()}function P(){localStorage.setItem("spotify_clone_mock_db",JSON.stringify(f))}function I(){const t=sessionStorage.getItem("spotify_clone_current_user")||localStorage.getItem("spotify_clone_current_user");return t?JSON.parse(t):null}function K(t){sessionStorage.setItem("spotify_clone_current_user",JSON.stringify(t)),localStorage.setItem("spotify_clone_current_user",JSON.stringify(t))}function ut(){sessionStorage.removeItem("spotify_clone_current_user"),localStorage.removeItem("spotify_clone_current_user")}function pt(t,i={}){const a=new URL(t,window.location.origin),e=a.pathname.replace(tt,""),s=(i.method||"GET").toUpperCase(),n=i.body?JSON.parse(i.body):null,p=(r,d=200)=>new Response(JSON.stringify(r),{status:d,headers:{"Content-Type":"application/json"}}),m=(r,d=400)=>new Response(JSON.stringify({error:r}),{status:d,headers:{"Content-Type":"application/json"}});if(ct(),e==="/api/health")return p({status:"OK",message:"Spotify Clone Mock API is running"});if(e==="/api/auth/me"){const r=I();return r?p({user:r}):m("Not authenticated",401)}if(e==="/api/auth/login"&&s==="POST"){const{email:r,password:d}=n,u=f.users.find(v=>(v.email===r||v.username===r)&&v.password===d);return u?(K(u),p({message:"Login successful",user:{id:u.id,username:u.username,email:u.email}})):m('Invalid credentials. (Hint: Try username "demo" and password "password123")',401)}if(e==="/api/auth/register"&&s==="POST"){const{username:r,email:d,password:u}=n;if(f.users.some(S=>S.email===d||S.username===r))return m("Username or email already exists");const v={id:Date.now(),username:r,email:d,password:u};return f.users.push(v),P(),K(v),p({message:"Registration successful",user:{id:v.id,username:v.username,email:v.email}})}if(e==="/api/auth/logout"&&s==="POST")return ut(),p({message:"Logout successful"});if(e==="/api/songs"&&s==="GET")return p(E(f.songs));if(e==="/api/songs/albums"&&s==="GET")return p(E(f.albums));if(e==="/api/songs/artists"&&s==="GET")return p(E(f.artists));const x=e.match(/^\/api\/songs\/albums\/(\d+)$/);if(x&&s==="GET"){const r=parseInt(x[1]),d=f.albums.find(v=>v.id===r);if(!d)return m("Album not found",404);const u=f.songs.filter(v=>v.album_id===r);return p(E({album:d,songs:u}))}const l=e.match(/^\/api\/songs\/artists\/(\d+)$/);if(l&&s==="GET"){const r=parseInt(l[1]),d=f.artists.find(S=>S.id===r);if(!d)return m("Artist not found",404);const u=f.songs.filter(S=>S.artist_id===r),v=f.albums.filter(S=>S.artist_id===r);return p(E({artist:d,songs:u,albums:v}))}if(e.startsWith("/api/songs/search")&&s==="GET"){const d=(a.searchParams.get("q")||"").toLowerCase(),u=f.songs.filter(_=>_.title.toLowerCase().includes(d)||_.artist_name.toLowerCase().includes(d)||_.album_title.toLowerCase().includes(d)),v=f.albums.filter(_=>_.title.toLowerCase().includes(d)||_.artist_name.toLowerCase().includes(d)),S=f.artists.filter(_=>_.name.toLowerCase().includes(d));return p(E({songs:u,albums:v,artists:S}))}if(e==="/api/liked/ids"&&s==="GET"){const r=I();if(!r)return m("Not authenticated",401);const d=f.likedSongs[r.username]||[];return p(d)}if(e==="/api/liked"&&s==="GET"){const r=I();if(!r)return m("Not authenticated",401);const d=f.likedSongs[r.username]||[],u=f.songs.filter(v=>d.includes(v.id));return p(E(u))}if(e==="/api/liked"&&s==="POST"){const r=I();if(!r)return m("Not authenticated",401);const{songId:d}=n;return f.likedSongs[r.username]||(f.likedSongs[r.username]=[]),f.likedSongs[r.username].includes(d)||(f.likedSongs[r.username].push(d),P()),p({success:!0})}const y=e.match(/^\/api\/liked\/(\d+)$/);if(y&&s==="DELETE"){const r=I();if(!r)return m("Not authenticated",401);const d=parseInt(y[1]);return f.likedSongs[r.username]&&(f.likedSongs[r.username]=f.likedSongs[r.username].filter(u=>u!==d),P()),p({success:!0})}if(e==="/api/playlists"&&s==="GET"){const r=I();if(!r)return m("Not authenticated",401);const d=f.playlists.filter(u=>u.owner===r.username);return p(E(d))}if(e==="/api/playlists"&&s==="POST"){const r=I();if(!r)return m("Not authenticated",401);const{name:d,description:u}=n,v=["/uploads/images/ocean_breeze.svg","/uploads/images/dark_mode.svg","/uploads/images/neon_city.svg"],S=v[Math.floor(Math.random()*v.length)],_={id:Date.now(),name:d,description:u||"",owner:r.username,cover_url:S,song_ids:[]};return f.playlists.push(_),P(),p(E(_))}const h=e.match(/^\/api\/playlists\/(\d+)$/);if(h){const r=parseInt(h[1]),d=f.playlists.find(u=>u.id===r);if(!d)return m("Playlist not found",404);if(s==="GET"){const u=f.songs.filter(v=>d.song_ids.includes(v.id));return p(E({playlist:d,songs:u}))}if(s==="PUT"){const{name:u,description:v}=n;return d.name=u,d.description=v||"",P(),p(E(d))}if(s==="DELETE")return f.playlists=f.playlists.filter(u=>u.id!==r),P(),p({success:!0})}const w=e.match(/^\/api\/playlists\/(\d+)\/songs$/);if(w&&s==="POST"){const r=parseInt(w[1]),{songId:d}=n,u=f.playlists.find(v=>v.id===r);return u?u.song_ids.includes(d)?m("Song already exists in this playlist"):(u.song_ids.push(d),P(),p({success:!0})):m("Playlist not found",404)}const c=e.match(/^\/api\/playlists\/(\d+)\/songs\/(\d+)$/);if(c&&s==="DELETE"){const r=parseInt(c[1]),d=parseInt(c[2]),u=f.playlists.find(v=>v.id===r);return u?(u.song_ids=u.song_ids.filter(v=>v!==d),P(),p({success:!0})):m("Playlist not found",404)}return m("Mock endpoint not found",404)}window.fetch=async function(t,i={}){if(await dt(),typeof t=="string"&&t.includes("/uploads/")&&(t=et(t)),M&&typeof t=="string"&&t.includes("/api/"))return pt(t,i);const a=await Z(t,i);if(a.ok&&typeof t=="string"&&t.includes("/api/")){const e=a.clone();try{const s=await e.json(),n=E(s);return new Response(JSON.stringify(n),{status:a.status,statusText:a.statusText,headers:a.headers})}catch{}}return a};class C{constructor(){this.audio=new Audio,this.playlist=[],this.currentIndex=-1,this.isPlaying=!1,this.isShuffle=!1,this.isRepeat="none",this.originalPlaylist=[],this.volume=.7,this.audio.volume=this.volume,this.isMuted=!1,this.onTrackChange=null,this.onPlayStateChange=null,this.onTimeUpdate=null,this.onQueueEnd=null,this.initAudioListeners()}initAudioListeners(){this.audio.addEventListener("timeupdate",()=>{if(this.onTimeUpdate&&this.audio.duration){const i=this.audio.currentTime,a=this.audio.duration,e=i/a*100;this.onTimeUpdate(i,a,e)}}),this.audio.addEventListener("ended",()=>{this.handleSongEnded()}),this.audio.addEventListener("error",i=>{console.error("Audio playback error:",i),this.isPlaying=!1,this.onPlayStateChange&&this.onPlayStateChange(!1)})}setPlaylist(i,a=0){!i||i.length===0||(this.playlist=[...i],this.originalPlaylist=[...i],this.currentIndex=a,this.isShuffle&&this.shufflePlaylist(a))}loadAndPlayCurrent(){if(this.currentIndex<0||this.currentIndex>=this.playlist.length)return;const i=this.playlist[this.currentIndex];this.audio.src=i.song_url,this.audio.load();const a=this.audio.play();a!==void 0&&a.then(()=>{this.isPlaying=!0,this.onPlayStateChange&&this.onPlayStateChange(!0),this.onTrackChange&&this.onTrackChange(i)}).catch(e=>{console.warn("Playback blocked or failed. User interaction required.",e),this.isPlaying=!1,this.onPlayStateChange&&this.onPlayStateChange(!1)})}playTrack(i,a){if(a&&a.length>0){const e=a.findIndex(s=>s.id===i.id);this.setPlaylist(a,e!==-1?e:0)}else this.setPlaylist([i],0);this.loadAndPlayCurrent()}togglePlay(){this.currentIndex!==-1&&(this.isPlaying?(this.audio.pause(),this.isPlaying=!1):(this.audio.play().catch(()=>{}),this.isPlaying=!0),this.onPlayStateChange&&this.onPlayStateChange(this.isPlaying))}next(){if(this.playlist.length!==0){if(this.isRepeat==="track"){this.audio.currentTime=0,this.audio.play().catch(()=>{});return}if(this.currentIndex++,this.currentIndex>=this.playlist.length)if(this.isRepeat==="playlist")this.currentIndex=0;else{this.currentIndex=this.playlist.length-1,this.isPlaying=!1,this.audio.pause(),this.onPlayStateChange&&this.onPlayStateChange(!1),this.onQueueEnd&&this.onQueueEnd();return}this.loadAndPlayCurrent()}}prev(){if(this.playlist.length!==0){if(this.audio.currentTime>3){this.audio.currentTime=0;return}this.currentIndex--,this.currentIndex<0&&(this.isRepeat==="playlist"?this.currentIndex=this.playlist.length-1:this.currentIndex=0),this.loadAndPlayCurrent()}}toggleShuffle(){if(this.isShuffle=!this.isShuffle,this.playlist.length===0)return this.isShuffle;const i=this.playlist[this.currentIndex];if(this.isShuffle)this.shufflePlaylist(this.currentIndex);else{const a=this.originalPlaylist.findIndex(e=>e.id===i.id);this.playlist=[...this.originalPlaylist],this.currentIndex=a!==-1?a:0}return this.isShuffle}shufflePlaylist(i){const a=this.playlist[i],e=this.playlist.filter((s,n)=>n!==i);for(let s=e.length-1;s>0;s--){const n=Math.floor(Math.random()*(s+1));[e[s],e[n]]=[e[n],e[s]]}this.playlist=[a,...e],this.currentIndex=0}toggleRepeat(){return this.isRepeat==="none"?this.isRepeat="playlist":this.isRepeat==="playlist"?this.isRepeat="track":this.isRepeat="none",this.isRepeat}handleSongEnded(){this.isRepeat==="track"?(this.audio.currentTime=0,this.audio.play().catch(()=>{})):this.next()}seek(i){if(!this.audio.duration)return;const a=i/100*this.audio.duration;this.audio.currentTime=a}setVolume(i){this.volume=Math.max(0,Math.min(1,i)),this.isMuted||(this.audio.volume=this.volume)}toggleMute(){return this.isMuted=!this.isMuted,this.audio.muted=this.isMuted,this.isMuted}static formatTime(i){if(isNaN(i))return"0:00";const a=Math.floor(i/60),e=Math.floor(i%60);return`${a}:${e<10?"0":""}${e}`}}const U=t=>C.formatTime(t),z=t=>`linear-gradient(to bottom, hsl(${t.split("").reduce((e,s)=>e+s.charCodeAt(0),0)%360}, 45%, 25%) 0%, var(--color-dark-gray) 100%)`,gt=()=>{const t=new Date().getHours();return t<12?"Good morning":t<18?"Good afternoon":"Good evening"},mt=(t,i,a)=>{const{albums:e,artists:s,songs:n}=i,{onPlaySong:p,onNavigate:m}=a,x=gt();t.innerHTML=`
    <div class="section-container" style="margin-top: 40px;">
      <h1 class="section-title" style="font-size: 32px; margin-bottom: 24px;">${x}</h1>
      
      <!-- Quick Play Grid -->
      <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 40px;">
        ${n.slice(0,6).map(l=>`
          <div class="library-item" style="background-color: var(--color-medium-gray); padding: 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: var(--transition-fast);" class="quick-play-row" data-id="${l.id}">
            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;" class="click-trigger" data-type="album" data-target-id="${l.album_id}">
              <img src="${l.cover_url}" class="library-item-img" style="width: 56px; height: 56px; border-radius: 4px 0 0 4px;" alt="${l.title}">
              <span style="font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px;">${l.title}</span>
            </div>
            <button class="quick-play-btn" style="background-color: var(--color-spotify-green); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--color-black); cursor: pointer; opacity: 0; transition: var(--transition-fast); margin-right: 8px;" data-song-id="${l.id}">
              <i class="bx bx-play" style="margin-left: 2px;"></i>
            </button>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Suggested Albums -->
    <div class="section-container">
      <h2 class="section-title">Featured Albums</h2>
      <div class="cards-grid">
        ${e.map(l=>`
          <div class="music-card" data-action="album" data-id="${l.id}">
            <div class="card-img-container">
              <img src="${l.cover_url}" class="card-img" alt="${l.title}">
              <button class="card-play-btn" data-album-id="${l.id}">
                <i class="bx bx-play" style="margin-left: 2px;"></i>
              </button>
            </div>
            <div class="card-title">${l.title}</div>
            <div class="card-desc">Album • ${l.artist_name}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Artists Section -->
    <div class="section-container" style="margin-top: 40px;">
      <h2 class="section-title">Popular Artists</h2>
      <div class="cards-grid">
        ${s.map(l=>`
          <div class="music-card" data-action="artist" data-id="${l.id}">
            <div class="card-img-container" style="border-radius: 50%;">
              <img src="${l.image_url}" class="card-img" alt="${l.name}" style="border-radius: 50%;">
              <button class="card-play-btn" data-artist-id="${l.id}" style="border-radius: 50%;">
                <i class="bx bx-play" style="margin-left: 2px;"></i>
              </button>
            </div>
            <div class="card-title">${l.name}</div>
            <div class="card-desc">Artist</div>
          </div>
        `).join("")}
      </div>
    </div>
  `,t.querySelectorAll(".music-card").forEach(l=>{l.addEventListener("click",y=>{if(y.target.closest(".card-play-btn"))return;const h=l.dataset.action,w=l.dataset.id;m(h,w)})}),t.querySelectorAll(".quick-play-row").forEach(l=>{l.addEventListener("mouseenter",()=>{const y=l.querySelector(".quick-play-btn");y&&(y.style.opacity="1")}),l.addEventListener("mouseleave",()=>{const y=l.querySelector(".quick-play-btn");y&&(y.style.opacity="0")}),l.querySelector(".click-trigger").addEventListener("click",y=>{const h=y.currentTarget.dataset.targetId;m("album",h)}),l.querySelector(".quick-play-btn").addEventListener("click",y=>{y.stopPropagation();const h=parseInt(y.currentTarget.dataset.songId),w=n.find(c=>c.id===h);w&&p(w,n)})}),t.querySelectorAll(".card-play-btn[data-album-id]").forEach(l=>{l.addEventListener("click",y=>{y.stopPropagation();const h=parseInt(l.dataset.albumId);m("album",h,{autoPlay:!0})})}),t.querySelectorAll(".card-play-btn[data-artist-id]").forEach(l=>{l.addEventListener("click",y=>{y.stopPropagation();const h=parseInt(l.dataset.artistId);m("artist",h,{autoPlay:!0})})})},Q=(t,i,a,e)=>{const{onPlaySong:s,onToggleLike:n,likedIds:p,onNavigate:m,onOpenPlaylistMenu:x}=e;if(!a){t.innerHTML=`
      <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-muted);">
        <i class="bx bx-search" style="font-size: 80px; margin-bottom: 16px;"></i>
        <h2 style="font-family: var(--font-header); font-weight: 700; color: #fff;">Search Spotify</h2>
        <p style="margin-top: 8px; font-size: 14px;">Find your favorite songs, artists, and albums</p>
      </div>
    `;return}const{songs:l,albums:y,artists:h}=i;if(l.length===0&&y.length===0&&h.length===0){t.innerHTML=`
      <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-muted);">
        <i class="bx bx-confused" style="font-size: 80px; margin-bottom: 16px;"></i>
        <h2 style="font-family: var(--font-header); font-weight: 700; color: #fff;">No results found for "${a}"</h2>
        <p style="margin-top: 8px; font-size: 14px;">Please check your spelling or try another keyword</p>
      </div>
    `;return}t.innerHTML=`
    <!-- Top Result & Songs Panel -->
    <div style="display: grid; grid-template-columns: 2fr 3fr; gap: 32px; margin-top: 32px;">
      
      <!-- Top Result -->
      <div>
        <h2 class="section-title">Top Result</h2>
        ${h.length>0?`
          <div class="music-card" style="background-color: var(--color-medium-gray); padding: 24px; border-radius: 8px; width: 100%; height: 260px; display: flex; flex-direction: column; justify-content: flex-end; position: relative;" data-action="artist" data-id="${h[0].id}">
            <img src="${h[0].image_url}" style="width: 92px; height: 92px; border-radius: 50%; box-shadow: 0 8px 24px rgba(0,0,0,0.5); margin-bottom: 24px;" alt="${h[0].name}">
            <div style="font-family: var(--font-header); font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px;">${h[0].name}</div>
            <div style="display: inline-block; background-color: rgba(0,0,0,0.2); padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 1px; width: fit-content;">Artist</div>
            <button class="card-play-btn" data-artist-id="${h[0].id}" style="bottom: 24px; right: 24px;">
              <i class="bx bx-play" style="margin-left: 2px;"></i>
            </button>
          </div>
        `:y.length>0?`
          <div class="music-card" style="background-color: var(--color-medium-gray); padding: 24px; border-radius: 8px; width: 100%; height: 260px; display: flex; flex-direction: column; justify-content: flex-end; position: relative;" data-action="album" data-id="${y[0].id}">
            <img src="${y[0].cover_url}" style="width: 92px; height: 92px; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); margin-bottom: 24px;" alt="${y[0].title}">
            <div style="font-family: var(--font-header); font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${y[0].title}</div>
            <div style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 8px;">Album • ${y[0].artist_name}</div>
            <button class="card-play-btn" data-album-id="${y[0].id}" style="bottom: 24px; right: 24px;">
              <i class="bx bx-play" style="margin-left: 2px;"></i>
            </button>
          </div>
        `:`
          <div class="music-card" style="background-color: var(--color-medium-gray); padding: 24px; border-radius: 8px; width: 100%; height: 260px; display: flex; flex-direction: column; justify-content: flex-end; position: relative;" data-action="song-play" data-song-id="${l[0].id}">
            <img src="${l[0].cover_url}" style="width: 92px; height: 92px; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); margin-bottom: 24px;" alt="${l[0].title}">
            <div style="font-family: var(--font-header); font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${l[0].title}</div>
            <div style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 8px;">Song • ${l[0].artist_name}</div>
            <button class="card-play-btn" data-song-idx="0" style="bottom: 24px; right: 24px;">
              <i class="bx bx-play" style="margin-left: 2px;"></i>
            </button>
          </div>
        `}
      </div>

      <!-- Songs Results -->
      <div>
        <h2 class="section-title">Songs</h2>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${l.slice(0,4).map((c,r)=>`
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; border-radius: 4px; transition: var(--transition-fast); cursor: pointer;" class="search-song-row" data-song-id="${c.id}">
              <div style="display: flex; align-items: center; gap: 16px; min-width: 0;">
                <div style="position: relative; width: 40px; height: 40px; flex-shrink: 0;">
                  <img src="${c.cover_url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" alt="${c.title}">
                  <div class="hover-play-icon" style="position: absolute; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.6); border-radius:4px; display: none; align-items: center; justify-content: center; font-size: 20px; color:#fff;">
                    <i class="bx bx-play"></i>
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; min-width: 0;">
                  <span style="font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="song-title-click">${c.title}</span>
                  <span style="font-size: 13px; color: var(--color-text-muted); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="song-artist-click" data-artist-id="${c.artist_id}">${c.artist_name}</span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 20px;">
                <button class="action-icon-btn ${p.includes(c.id)?"liked":""}" data-action="like" data-song-id="${c.id}">
                  <i class="bx ${p.includes(c.id)?"bxs-heart":"bx-heart"}"></i>
                </button>
                <div style="font-size: 13px; color: var(--color-text-muted); width: 40px; text-align: right;">${U(c.duration)}</div>
                <button class="action-icon-btn" data-action="add-to-playlist" data-song-id="${c.id}">
                  <i class="bx bx-plus"></i>
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- Albums Results -->
    ${y.length>0?`
      <div class="section-container" style="margin-top: 40px;">
        <h2 class="section-title">Albums</h2>
        <div class="cards-grid">
          ${y.map(c=>`
            <div class="music-card" data-action="album" data-id="${c.id}">
              <div class="card-img-container">
                <img src="${c.cover_url}" class="card-img" alt="${c.title}">
                <button class="card-play-btn" data-album-id="${c.id}">
                  <i class="bx bx-play" style="margin-left: 2px;"></i>
                </button>
              </div>
              <div class="card-title">${c.title}</div>
              <div class="card-desc">${c.release_year} • ${c.artist_name}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `:""}

    <!-- Artists Results -->
    ${h.length>0?`
      <div class="section-container" style="margin-top: 40px;">
        <h2 class="section-title">Artists</h2>
        <div class="cards-grid">
          ${h.map(c=>`
            <div class="music-card" data-action="artist" data-id="${c.id}">
              <div class="card-img-container" style="border-radius: 50%;">
                <img src="${c.image_url}" class="card-img" alt="${c.name}" style="border-radius: 50%;">
                <button class="card-play-btn" data-artist-id="${c.id}" style="border-radius: 50%;">
                  <i class="bx bx-play" style="margin-left: 2px;"></i>
                </button>
              </div>
              <div class="card-title">${c.name}</div>
              <div class="card-desc">Artist</div>
            </div>
          `).join("")}
        </div>
      </div>
    `:""}
  `,t.querySelectorAll(".search-song-row").forEach(c=>{const r=parseInt(c.dataset.songId),d=l.find(u=>u.id===r);c.addEventListener("mouseenter",()=>{c.querySelector(".hover-play-icon").style.display="flex"}),c.addEventListener("mouseleave",()=>{c.querySelector(".hover-play-icon").style.display="none"}),c.querySelector(".hover-play-icon").addEventListener("click",u=>{u.stopPropagation(),s(d,l)}),c.querySelector(".song-title-click").addEventListener("click",u=>{u.stopPropagation(),s(d,l)}),c.querySelector(".song-artist-click").addEventListener("click",u=>{u.stopPropagation();const v=u.currentTarget.dataset.artistId;m("artist",v)}),c.querySelector('[data-action="like"]').addEventListener("click",u=>{u.stopPropagation(),n(r)}),c.querySelector('[data-action="add-to-playlist"]').addEventListener("click",u=>{u.stopPropagation(),x(u.currentTarget,r)})});const w=t.querySelector(".music-card");w&&w.addEventListener("click",c=>{if(c.target.closest(".card-play-btn"))return;const r=w.dataset.action,d=w.dataset.id;if(r==="song-play"){const u=parseInt(w.dataset.songId),v=l.find(S=>S.id===u);s(v,l)}else m(r,d)}),t.querySelectorAll(".card-play-btn[data-artist-id]").forEach(c=>{c.addEventListener("click",r=>{r.stopPropagation();const d=parseInt(c.dataset.artistId);m("artist",d,{autoPlay:!0})})}),t.querySelectorAll(".card-play-btn[data-album-id]").forEach(c=>{c.addEventListener("click",r=>{r.stopPropagation();const d=parseInt(c.dataset.albumId);m("album",d,{autoPlay:!0})})}),t.querySelectorAll(".cards-grid .music-card").forEach(c=>{c.addEventListener("click",r=>{if(r.target.closest(".card-play-btn"))return;const d=c.dataset.action,u=c.dataset.id;m(d,u)})})},q=(t,i,a=!1)=>t.length===0?`
      <div style="padding: 40px; text-align: center; color: var(--color-text-muted); font-size: 14px;">
        No songs found in this list.
      </div>
    `:`
    <table class="songs-table">
      <thead>
        <tr>
          <th style="width: 48px; text-align: center;">#</th>
          <th>Title</th>
          <th>Album</th>
          <th style="text-align: right; width: 120px;"><i class="bx bx-time" style="font-size: 18px;"></i></th>
          <th style="width: 48px;"></th>
        </tr>
      </thead>
      <tbody>
        ${t.map((e,s)=>`
          <tr data-song-id="${e.id}" class="song-row">
            <td class="td-index">${s+1}</td>
            <td class="td-play-icon" data-song-idx="${s}"><i class="bx bx-play-circle"></i></td>
            <td>
              <div class="td-title">
                <img src="${e.cover_url}" class="td-title-img" alt="${e.title}">
                <div class="td-title-text">
                  <span class="td-title-name" data-song-idx="${s}">${e.title}</span>
                  <span class="td-title-artist" data-artist-id="${e.artist_id}">${e.artist_name}</span>
                </div>
              </div>
            </td>
            <td class="td-album" data-album-id="${e.album_id}">${e.album_title}</td>
            <td class="td-duration">
              <div style="display: flex; align-items: center; justify-content: flex-end; gap: 16px;">
                <button class="action-icon-btn ${i.includes(e.id)?"liked":""}" data-action="like" data-song-id="${e.id}">
                  <i class="bx ${i.includes(e.id)?"bxs-heart":"bx-heart"}"></i>
                </button>
                <span>${U(e.duration)}</span>
              </div>
            </td>
            <td class="td-actions">
              ${a?`
                <button class="action-icon-btn remove-playlist-song-btn" data-action="remove" data-song-id="${e.id}" title="Remove from playlist">
                  <i class="bx bx-minus-circle"></i>
                </button>
              `:`
                <button class="action-icon-btn add-to-playlist-row-btn" data-action="add" data-song-id="${e.id}">
                  <i class="bx bx-plus"></i>
                </button>
              `}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `,N=(t,i,a,e=!1)=>{const{onPlaySong:s,onToggleLike:n,onNavigate:p,onOpenPlaylistMenu:m,onRemoveSongFromPlaylist:x}=a;t.querySelectorAll(".song-row").forEach(l=>{const y=parseInt(l.dataset.songId),h=i.find(r=>r.id===y);l.querySelectorAll(".td-play-icon, .td-title-name").forEach(r=>{r.addEventListener("click",d=>{d.stopPropagation(),s(h,i)})}),l.querySelector(".td-title-artist").addEventListener("click",r=>{r.stopPropagation();const d=r.currentTarget.dataset.artistId;p("artist",d)}),l.querySelector(".td-album").addEventListener("click",r=>{r.stopPropagation();const d=r.currentTarget.dataset.albumId;p("album",d)}),l.querySelector('[data-action="like"]').addEventListener("click",r=>{r.stopPropagation(),n(y)});const c=l.querySelector('[data-action="add"], [data-action="remove"]');c&&c.addEventListener("click",r=>{r.stopPropagation(),c.dataset.action==="remove"?x(y):m(r.currentTarget,y)})})},yt=(t,i,a)=>{const{album:e,songs:s}=i,{likedIds:n,onPlaySong:p,onNavigate:m}=a,x=z(e.title);t.innerHTML=`
    <div class="view-hero" style="background: ${x}">
      <div class="hero-img-container">
        <img src="${e.cover_url}" alt="${e.title}">
      </div>
      <div class="hero-details">
        <span class="hero-type">Album</span>
        <h1 class="hero-title">${e.title}</h1>
        <div class="hero-meta">
          <span class="artist-nav-link" style="cursor:pointer;" id="hero-artist-link">${e.artist_name}</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${e.release_year}</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${s.length} song${s.length!==1?"s":""}</span>
        </div>
      </div>
    </div>

    <div class="view-action-bar">
      <button class="play-main-btn" id="album-play-btn"><i class="bx bx-play" style="margin-left: 2px;"></i></button>
    </div>

    <!-- Song Table List -->
    ${q(s,n,!1)}
  `;const l=t.querySelector("#hero-artist-link");l&&l.addEventListener("click",()=>{m("artist",e.artist_id)});const y=t.querySelector("#album-play-btn");y&&s.length>0&&y.addEventListener("click",()=>{p(s[0],s)}),N(t,s,a)},ht=(t,i,a)=>{const{artist:e,albums:s,songs:n}=i,{likedIds:p,onPlaySong:m,onNavigate:x}=a,l=z(e.name);t.innerHTML=`
    <div class="view-hero" style="background: ${l}; min-height: 280px; align-items: center; padding: 40px 0 24px 0;">
      <div class="hero-img-container" style="border-radius: 50%; width: 200px; height: 200px;">
        <img src="${e.image_url}" alt="${e.name}" style="border-radius: 50%;">
      </div>
      <div class="hero-details">
        <span class="hero-type">Artist</span>
        <h1 class="hero-title" style="font-size: 72px; margin-bottom: 8px;">${e.name}</h1>
        <p style="color: var(--color-text-muted); font-size: 14px; line-height: 1.6; max-width: 600px; margin-bottom: 12px; font-style: italic;">
          "${e.bio||"No biography details available."}"
        </p>
      </div>
    </div>

    <div class="view-action-bar">
      <button class="play-main-btn" id="artist-play-btn"><i class="bx bx-play" style="margin-left: 2px;"></i></button>
    </div>

    <!-- Popular songs (Top Songs) -->
    <div class="section-container" style="margin-bottom: 40px;">
      <h2 class="section-title">Popular Tracks</h2>
      ${q(n,p,!1)}
    </div>

    <!-- Artist Albums -->
    <div class="section-container">
      <h2 class="section-title">Albums</h2>
      <div class="cards-grid">
        ${s.map(h=>`
          <div class="music-card" data-action="album" data-id="${h.id}">
            <div class="card-img-container">
              <img src="${h.cover_url}" class="card-img" alt="${h.title}">
              <button class="card-play-btn" data-album-id="${h.id}">
                <i class="bx bx-play" style="margin-left: 2px;"></i>
              </button>
            </div>
            <div class="card-title">${h.title}</div>
            <div class="card-desc">${h.release_year} • Album</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;const y=t.querySelector("#artist-play-btn");y&&n.length>0&&y.addEventListener("click",()=>{m(n[0],n)}),t.querySelectorAll(".cards-grid .music-card").forEach(h=>{h.addEventListener("click",w=>{if(w.target.closest(".card-play-btn"))return;const c=h.dataset.action,r=h.dataset.id;x(c,r)})}),t.querySelectorAll(".card-play-btn[data-album-id]").forEach(h=>{h.addEventListener("click",w=>{w.stopPropagation();const c=parseInt(h.dataset.albumId);x("album",c,{autoPlay:!0})})}),N(t,n,a)},ft=(t,i,a)=>{const{playlist:e,songs:s}=i,{likedIds:n,onPlaySong:p,onEditPlaylist:m,onDeletePlaylist:x}=a,l=z(e.name),y=s.reduce((B,O)=>B+O.duration,0),h=U(y);t.innerHTML=`
    <div class="view-hero" style="background: ${l}">
      <div class="hero-img-container">
        <img src="${e.cover_url}" alt="${e.name}">
      </div>
      <div class="hero-details">
        <span class="hero-type">Playlist</span>
        
        <!-- Editable playlist name and description -->
        <h1 class="hero-title" id="playlist-title-display">${e.name}</h1>
        <p style="color: var(--color-text-muted); font-size: 14px; margin-bottom: 12px;" id="playlist-desc-display">
          ${e.description||"No description provided."}
        </p>

        <!-- Hidden edit inputs, toggleable -->
        <div id="playlist-edit-form-inline" class="hidden" style="display:flex; flex-direction:column; gap: 8px; margin-bottom: 12px; max-width: 400px;">
          <input type="text" id="edit-playlist-name-input" value="${e.name}" style="background-color: var(--color-light-gray); border: 1px solid var(--color-active-gray); color: #fff; padding: 6px 12px; border-radius: 4px; font-weight: bold;">
          <input type="text" id="edit-playlist-desc-input" value="${e.description||""}" placeholder="Add a description" style="background-color: var(--color-light-gray); border: 1px solid var(--color-active-gray); color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 13px;">
          <div style="display:flex; gap: 8px; margin-top: 4px;">
            <button class="outline-action-btn" id="btn-save-playlist-details" style="padding:4px 12px; background-color: var(--color-spotify-green); border-color:var(--color-spotify-green); color: #000;">Save</button>
            <button class="outline-action-btn" id="btn-cancel-playlist-details" style="padding:4px 12px;">Cancel</button>
          </div>
        </div>

        <div class="hero-meta">
          <span>Your Playlist</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${s.length} song${s.length!==1?"s":""}</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${h}</span>
        </div>
      </div>
    </div>

    <div class="view-action-bar">
      <button class="play-main-btn" id="playlist-play-btn"><i class="bx bx-play" style="margin-left: 2px;"></i></button>
      <button class="outline-action-btn" id="btn-edit-playlist">Edit Details</button>
      <button class="outline-action-btn" id="btn-delete-playlist" style="border-color: #ff4d4d; color: #ff4d4d;">Delete</button>
    </div>

    <!-- Playlist Song Table List -->
    ${q(s,n,!0)}
  `;const w=t.querySelector("#playlist-play-btn");w&&s.length>0&&w.addEventListener("click",()=>{p(s[0],s)});const c=t.querySelector("#btn-edit-playlist"),r=t.querySelector("#btn-delete-playlist"),d=t.querySelector("#playlist-title-display"),u=t.querySelector("#playlist-desc-display"),v=t.querySelector("#playlist-edit-form-inline"),S=t.querySelector("#btn-cancel-playlist-details"),_=t.querySelector("#btn-save-playlist-details");c.addEventListener("click",()=>{d.classList.add("hidden"),u.classList.add("hidden"),v.classList.remove("hidden")}),S.addEventListener("click",()=>{d.classList.remove("hidden"),u.classList.remove("hidden"),v.classList.add("hidden")}),_.addEventListener("click",()=>{const B=t.querySelector("#edit-playlist-name-input").value.trim(),O=t.querySelector("#edit-playlist-desc-input").value.trim();B&&m(e.id,B,O)}),r.addEventListener("click",()=>{confirm("Are you sure you want to delete this playlist? This cannot be undone.")&&x(e.id)}),N(t,s,a,!0)},vt=(t,i,a)=>{const{likedIds:e,onPlaySong:s}=a;t.innerHTML=`
    <div class="view-hero" style="background: linear-gradient(to bottom, #5038a0 0%, var(--color-dark-gray) 100%)">
      <div class="hero-img-container" style="background: linear-gradient(135deg, #450ffd 0%, #c1acff 100%); display:flex; align-items:center; justify-content:center;">
        <i class="bx bxs-heart" style="font-size: 100px; color: #fff;"></i>
      </div>
      <div class="hero-details">
        <span class="hero-type">Playlist</span>
        <h1 class="hero-title">Liked Songs</h1>
        <div class="hero-meta">
          <span>Your Favorites</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${i.length} song${i.length!==1?"s":""}</span>
        </div>
      </div>
    </div>

    <div class="view-action-bar">
      <button class="play-main-btn" id="liked-play-btn"><i class="bx bx-play" style="margin-left: 2px;"></i></button>
    </div>

    <!-- Songs Table List -->
    ${q(i,e,!1)}
  `;const n=t.querySelector("#liked-play-btn");n&&i.length>0&&n.addEventListener("click",()=>{s(i[0],i)}),N(t,i,a)},bt=(t,i,a,e)=>{if(i.length===0){t.innerHTML=`
      <div class="auth-required-message" style="margin: 8px 0;">
        <p>No playlists created yet. Click the "+" button above to create one!</p>
      </div>
    `;return}t.innerHTML=i.map(s=>`
    <div class="library-item ${parseInt(a)===s.id?"active":""}" data-playlist-id="${s.id}">
      <img src="${s.cover_url}" class="library-item-img" alt="${s.name}">
      <div class="library-item-info">
        <div class="library-item-name">${s.name}</div>
        <div class="library-item-desc">Playlist • By You</div>
      </div>
    </div>
  `).join(""),t.querySelectorAll(".library-item").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.playlistId;e(n)})})},xt=(t,i,a)=>{const{onShowLogin:e,onShowSignup:s,onLogout:n}=a;if(i){t.innerHTML=`
      <div class="profile-tag" id="profile-tag-menu">
        <div class="profile-avatar">${i.username[0].toUpperCase()}</div>
        <span class="profile-name">${i.username}</span>
      </div>
      <button class="outline-action-btn" id="btn-logout-action" style="padding: 6px 16px; font-size:12px;">Log out</button>
    `;const p=t.querySelector("#btn-logout-action");p&&p.addEventListener("click",n)}else t.innerHTML=`
      <button class="btn btn-text" id="btn-show-signup-inline">Sign up</button>
      <button class="btn btn-white" id="btn-show-login-inline">Log in</button>
    `,t.querySelector("#btn-show-signup-inline").addEventListener("click",s),t.querySelector("#btn-show-login-inline").addEventListener("click",e)},b=new C;let g={currentUser:null,likedSongIds:[],userPlaylists:[],currentView:"home",currentViewId:null,searchQuery:"",activePlaylistId:null};const o={mainView:document.getElementById("main-view"),libraryPlaylists:document.getElementById("library-playlists"),authControls:document.getElementById("auth-controls"),navHome:document.getElementById("nav-home"),navSearch:document.getElementById("nav-search"),searchBarWrapper:document.getElementById("search-bar-wrapper"),searchInput:document.getElementById("search-input"),createPlaylistBtn:document.getElementById("create-playlist-btn"),authModal:document.getElementById("auth-modal"),authModalClose:document.getElementById("auth-modal-close"),tabLogin:document.getElementById("tab-login"),tabSignup:document.getElementById("tab-signup"),formLogin:document.getElementById("form-login"),formSignup:document.getElementById("form-signup"),loginError:document.getElementById("login-error"),signupError:document.getElementById("signup-error"),playerTrackInfo:document.getElementById("player-track-info"),playerLikeBtn:document.getElementById("player-like-btn"),playerShuffle:document.getElementById("player-shuffle"),playerPrev:document.getElementById("player-prev"),playerPlayPause:document.getElementById("player-play-pause"),playerNext:document.getElementById("player-next"),playerRepeat:document.getElementById("player-repeat"),playerMute:document.getElementById("player-mute"),playerTimeCurrent:document.getElementById("player-time-current"),playerTimeTotal:document.getElementById("player-time-total"),progressBarWrapper:document.getElementById("progress-bar-wrapper"),progressBarFill:document.getElementById("progress-bar-fill"),progressThumb:document.getElementById("progress-thumb"),volumeBarWrapper:document.getElementById("volume-bar-wrapper"),volumeBarFill:document.getElementById("volume-bar-fill"),volumeThumb:document.getElementById("volume-thumb")};let L=null;document.addEventListener("DOMContentLoaded",()=>{wt(),St(),kt(),k("home")});async function wt(){try{const t=await fetch("/api/auth/me");if(t.ok){const i=await t.json();g.currentUser=i.user,await Promise.all([V(),T()])}}catch(t){console.error("Session check failed",t)}finally{R()}}async function V(){if(g.currentUser)try{const t=await fetch("/api/liked/ids");t.ok&&(g.likedSongIds=await t.json())}catch(t){console.error("Error fetching liked song IDs",t)}}async function T(){if(g.currentUser)try{const t=await fetch("/api/playlists");t.ok&&(g.userPlaylists=await t.json(),it())}catch(t){console.error("Error fetching user playlists",t)}}async function k(t,i=null,a={}){g.currentView=t,g.currentViewId=i,o.navHome.classList.toggle("active",t==="home"),o.navSearch.classList.toggle("active",t==="search"),o.searchBarWrapper.style.display=t==="search"?"flex":"none",o.mainView.innerHTML='<div style="height: 60vh; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--color-text-muted);">Loading...</div>';try{if((t==="liked"||t==="playlist")&&!g.currentUser){o.mainView.innerHTML=`
        <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-muted);">
          <i class="bx bx-lock-alt" style="font-size: 80px; margin-bottom: 16px;"></i>
          <h2 style="font-family: var(--font-header); font-weight: 700; color: #fff;">Login Required</h2>
          <p style="margin-top: 8px; font-size: 14px; margin-bottom: 24px;">Register or log in to access your personal playlists and favorites.</p>
          <button class="btn btn-white" id="btn-view-auth-trigger">Log In</button>
        </div>
      `,o.mainView.querySelector("#btn-view-auth-trigger").addEventListener("click",$);return}const e={onPlaySong:A,onToggleLike:at,likedIds:g.likedSongIds,onNavigate:k,onOpenPlaylistMenu:It,onRemoveSongFromPlaylist:Pt,onEditPlaylist:_t,onDeletePlaylist:Lt};if(t==="home"){const[s,n,p]=await Promise.all([fetch("/api/songs/albums"),fetch("/api/songs/artists"),fetch("/api/songs")]),m=await s.json(),x=await n.json(),l=await p.json();mt(o.mainView,{albums:m,artists:x,songs:l,likedIds:g.likedSongIds},e)}else if(t==="search")if(!g.searchQuery)Q(o.mainView,null,"",e);else{const n=await(await fetch(`/api/songs/search?q=${encodeURIComponent(g.searchQuery)}`)).json();Q(o.mainView,n,g.searchQuery,e)}else if(t==="album"){const s=await fetch(`/api/songs/albums/${i}`);if(!s.ok)throw new Error("Album not found");const n=await s.json();yt(o.mainView,n,e),a.autoPlay&&n.songs.length>0&&A(n.songs[0],n.songs)}else if(t==="artist"){const s=await fetch(`/api/songs/artists/${i}`);if(!s.ok)throw new Error("Artist not found");const n=await s.json();ht(o.mainView,n,e),a.autoPlay&&n.songs.length>0&&A(n.songs[0],n.songs)}else if(t==="playlist"){const s=await fetch(`/api/playlists/${i}`);if(!s.ok)throw new Error("Playlist not found");const n=await s.json();ft(o.mainView,n,e),a.autoPlay&&n.songs.length>0&&A(n.songs[0],n.songs)}else if(t==="liked"){const n=await(await fetch("/api/liked")).json();vt(o.mainView,n,e)}st()}catch(e){console.error("Error rendering view",e),o.mainView.innerHTML=`
      <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ff4d4d;">
        <i class="bx bx-error-circle" style="font-size: 80px; margin-bottom: 16px;"></i>
        <h2 style="font-family: var(--font-header); font-weight: 700;">Error loading page</h2>
        <p style="margin-top: 8px; font-size: 14px; color: var(--color-text-muted);">The requested content could not be retrieved.</p>
      </div>
    `}}function St(){o.navHome.addEventListener("click",t=>{t.preventDefault(),k("home")}),o.navSearch.addEventListener("click",t=>{t.preventDefault(),k("search")}),o.searchInput.addEventListener("input",t=>{g.searchQuery=t.target.value.trim(),k("search")}),o.createPlaylistBtn.addEventListener("click",async()=>{if(!g.currentUser){$();return}try{const t=`My Playlist #${g.userPlaylists.length+1}`,i=await fetch("/api/playlists",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,description:"Created with love."})});if(i.ok){const a=await i.json();await T(),k("playlist",a.id)}}catch(t){console.error("Error creating playlist",t)}}),document.addEventListener("click",()=>{D()}),o.authModalClose.addEventListener("click",F),o.tabLogin.addEventListener("click",()=>H("login")),o.tabSignup.addEventListener("click",()=>H("signup")),o.formLogin.addEventListener("submit",Tt),o.formSignup.addEventListener("submit",Mt)}function it(){bt(o.libraryPlaylists,g.userPlaylists,g.currentView==="playlist"?g.currentViewId:null,t=>k("playlist",t))}function R(){xt(o.authControls,g.currentUser,{onShowLogin:()=>$("login"),onShowSignup:()=>$("signup"),onLogout:Bt}),g.currentUser?o.createPlaylistBtn.style.display="flex":(o.libraryPlaylists.innerHTML=`
      <div class="auth-required-message">
        <p>Log in to create and view playlists</p>
      </div>
    `,g.likedSongIds=[],g.userPlaylists=[])}function kt(){X(o.volumeBarWrapper,t=>{o.volumeBarFill.style.width=`${t}%`,o.volumeThumb&&(o.volumeThumb.style.left=`${t}%`),b.setVolume(t/100),Y(t/100)}),X(o.progressBarWrapper,t=>{b.seek(t)}),o.playerPlayPause.addEventListener("click",()=>b.togglePlay()),o.playerNext.addEventListener("click",()=>b.next()),o.playerPrev.addEventListener("click",()=>b.prev()),o.playerShuffle.addEventListener("click",()=>{const t=b.toggleShuffle();o.playerShuffle.classList.toggle("active",t)}),o.playerRepeat.addEventListener("click",()=>{const t=b.toggleRepeat();o.playerRepeat.classList.toggle("active",t!=="none");const i=o.playerRepeat.querySelector("i");t==="track"||t==="playlist"?(o.playerRepeat.style.color="var(--color-spotify-green)",i.className="bx bx-repeat"):(o.playerRepeat.style.color="",i.className="bx bx-repeat")}),o.playerMute.addEventListener("click",()=>{const t=b.toggleMute(),i=o.playerMute.querySelector("i");if(t)i.className="bx bx-volume-mute",o.volumeBarFill.style.width="0%",o.volumeThumb&&(o.volumeThumb.style.left="0%");else{const a=b.volume*100;o.volumeBarFill.style.width=`${a}%`,o.volumeThumb&&(o.volumeThumb.style.left=`${a}%`),Y(b.volume)}}),o.playerLikeBtn.addEventListener("click",()=>{if(b.currentIndex===-1)return;const t=b.playlist[b.currentIndex];at(t.id)}),b.onTrackChange=t=>{o.playerTrackInfo.innerHTML=`
      <img src="${t.cover_url}" class="library-item-img" style="width:56px; height:56px; border-radius:4px;" alt="${t.title}">
      <div class="track-text">
        <span class="track-name" id="bottom-track-name">${t.title}</span>
        <span class="track-artist" id="bottom-track-artist" style="cursor:pointer;">${t.artist_name}</span>
      </div>
    `,o.playerTrackInfo.querySelector("#bottom-track-artist").addEventListener("click",()=>{k("artist",t.artist_id)}),o.playerLikeBtn.disabled=!g.currentUser,nt(t.id),st()},b.onPlayStateChange=t=>{const i=o.playerPlayPause.querySelector("i");i.className=t?"bx bx-pause-circle":"bx bx-play-circle"},b.onTimeUpdate=(t,i,a)=>{o.playerTimeCurrent.textContent=C.formatTime(t),o.playerTimeTotal.textContent=C.formatTime(i),o.progressBarFill.style.width=`${a}%`,o.progressThumb&&(o.progressThumb.style.left=`${a}%`)}}function st(){if(b.currentIndex===-1||b.playlist.length===0)return;const t=b.playlist[b.currentIndex];document.querySelectorAll(".songs-table tbody tr").forEach(a=>{a.classList.remove("active-song");const e=a.querySelector(".td-index");if(e){parseInt(a.dataset.songId),e.style.color="";const s=e.getAttribute("data-original-index")||e.textContent;e.textContent=s}});const i=document.querySelector(`.songs-table tbody tr[data-song-id="${t.id}"]`);if(i){i.classList.add("active-song");const a=i.querySelector(".td-index");a&&(a.getAttribute("data-original-index")||a.setAttribute("data-original-index",a.textContent),a.style.color="var(--color-spotify-green)",a.innerHTML='<i class="bx bxs-volume-full"></i>')}}function A(t,i){b.playTrack(t,i)}async function at(t){if(!g.currentUser){$();return}const i=g.likedSongIds.includes(t),a=i?"DELETE":"POST",e=i?`/api/liked/${t}`:"/api/liked";try{(await fetch(e,{method:a,headers:{"Content-Type":"application/json"},body:i?null:JSON.stringify({songId:t})})).ok&&(i?g.likedSongIds=g.likedSongIds.filter(n=>n!==t):g.likedSongIds.push(t),Et(t,!i),b.currentIndex!==-1&&b.playlist[b.currentIndex].id===t&&nt(t),g.currentView==="liked"&&k("liked"))}catch(s){console.error("Error toggling like",s)}}function Et(t,i){document.querySelectorAll(`[data-song-id="${t}"][data-action="like"]`).forEach(e=>{e.classList.toggle("liked",i);const s=e.querySelector("i");s&&(s.className=i?"bx bxs-heart":"bx bx-heart")})}function nt(t){const i=g.likedSongIds.includes(t);o.playerLikeBtn.classList.toggle("liked",i);const a=o.playerLikeBtn.querySelector("i");a&&(a.className=i?"bx bxs-heart":"bx bx-heart")}async function _t(t,i,a){try{const e=await fetch(`/api/playlists/${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:i,description:a})});if(e.ok)await T(),k("playlist",t);else{const s=await e.json();alert(s.error||"Failed to update playlist")}}catch(e){console.error("Error updating playlist details",e)}}async function Lt(t){try{(await fetch(`/api/playlists/${t}`,{method:"DELETE"})).ok&&(await T(),k("home"))}catch(i){console.error("Error deleting playlist",i)}}async function Pt(t){const i=g.currentViewId;try{(await fetch(`/api/playlists/${i}/songs/${t}`,{method:"DELETE"})).ok&&k("playlist",i)}catch(a){console.error("Error removing song from playlist",a)}}function It(t,i){if(!g.currentUser){$();return}if(D(),g.userPlaylists.length===0){alert("Please create a playlist first in the sidebar library!");return}L=document.createElement("div"),L.className="dropdown-menu show";const a=t.getBoundingClientRect();L.style.position="fixed",L.style.left=`${a.left-130}px`,L.style.top=`${a.top+window.scrollY+28}px`,L.innerHTML=`
    <div style="padding: 6px 12px; font-size:11px; text-transform:uppercase; color:var(--color-text-subtle); font-weight:700;">Add to Playlist</div>
    ${g.userPlaylists.map(e=>`
      <div class="dropdown-item" data-playlist-id="${e.id}">${e.name}</div>
    `).join("")}
  `,L.querySelectorAll(".dropdown-item").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const n=e.dataset.playlistId;await $t(n,i),D()})}),document.body.appendChild(L)}async function $t(t,i){try{const a=await fetch(`/api/playlists/${t}/songs`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({songId:i})});if(a.ok)alert("Track added to playlist successfully!");else{const e=await a.json();alert(e.error||"Song already exists in this playlist.")}}catch(a){console.error("Error mapping song to playlist",a)}}function D(){L&&(L.remove(),L=null)}function $(t="login"){o.authModal.classList.add("show"),H(t)}function F(){o.authModal.classList.remove("show"),o.loginError.textContent="",o.signupError.textContent="",o.formLogin.reset(),o.formSignup.reset()}function H(t){o.tabLogin.classList.toggle("active",t==="login"),o.tabSignup.classList.toggle("active",t==="signup"),o.formLogin.classList.toggle("hidden",t!=="login"),o.formSignup.classList.toggle("hidden",t!=="signup")}async function Tt(t){t.preventDefault();const i=document.getElementById("login-email").value,a=document.getElementById("login-password").value;o.loginError.textContent="";try{const e=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i,password:a})});if(e.ok){const s=await e.json();g.currentUser=s.user,F(),await Promise.all([V(),T()]),R(),k(g.currentView,g.currentViewId)}else{const s=await e.json();o.loginError.textContent=s.error||"Failed to login"}}catch(e){console.error("Login error",e),o.loginError.textContent="Server connection failed."}}async function Mt(t){t.preventDefault();const i=document.getElementById("signup-username").value.trim(),a=document.getElementById("signup-email").value.trim(),e=document.getElementById("signup-password").value;if(o.signupError.textContent="",e.length<6){o.signupError.textContent="Password must be at least 6 characters.";return}try{const s=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:i,email:a,password:e})});if(s.ok){const n=await s.json();g.currentUser=n.user,F(),await Promise.all([V(),T()]),R(),k(g.currentView,g.currentViewId)}else{const n=await s.json();o.signupError.textContent=n.error||"Failed to sign up"}}catch(s){console.error("Registration error",s),o.signupError.textContent="Server connection failed."}}async function Bt(){try{(await fetch("/api/auth/logout",{method:"POST"})).ok&&(g.currentUser=null,g.likedSongIds=[],g.userPlaylists=[],(g.currentView==="playlist"||g.currentView==="liked")&&(b.audio.pause(),b.isPlaying=!1,b.onPlayStateChange(!1)),R(),it(),k("home"))}catch(t){console.error("Logout error",t)}}function X(t,i){let a=!1;const e=m=>{const x=t.getBoundingClientRect(),y=(m.clientX||m.touches&&m.touches[0].clientX)-x.left,h=x.width;return Math.max(0,Math.min(100,y/h*100))},s=m=>{a=!0,n(m)},n=m=>{if(!a)return;const x=e(m);i(x)},p=()=>{a=!1};t.addEventListener("mousedown",s),window.addEventListener("mousemove",n),window.addEventListener("mouseup",p),t.addEventListener("touchstart",s,{passive:!0}),window.addEventListener("touchmove",n,{passive:!0}),window.addEventListener("touchend",p)}function Y(t){const i=o.playerMute.querySelector("i");t===0?i.className="bx bx-volume-mute":t<.3?i.className="bx bx-volume":t<.7?i.className="bx bx-volume-low":i.className="bx bx-volume-full"}
