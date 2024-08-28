const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('div p')
const cdThumb = $('.cd-thumbnail')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-shuffle')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const songName = $('.playing-song-name')
const song = $$('.song')
const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

   const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            name: "Nắng lung linh",
            singer: "NguyenThuong",
            path: "/assets/music/nll.mp3",
            image: "/assets/img/nll.jpg",
        },
        {
            name: "Suýt nữa thì",
            singer: "Andiez",
            path: "/assets/music/snt.mp3",
            image: "/assets/img/snt.jpg",
        },
        {
            name: "Regret",
            singer: " Lâm Bảo Ngọc, Quân A.P, Ali Hoàng Dương, Pháp Kiều, Quang Trung",
            path: "/assets/music/regret.mp3",
            image: "/assets/img/regret.jpg",
        },
        {
            name: "Hào Quang",
            singer: "Rhyder, Dương Domic, Pháp Kiều",
            path: "/assets/music/hq.mp3",
            image: "/assets/img/hq.jpg",
        },
        {
            name: "Hút",
            singer: "Quân A.P, Lou Hoàng, Nicky, Hải Đăng Doo, WEAN, Ali, Pháp Kiều",
            path: "/assets/music/hut.mp3",
            image: "/assets/img/hut.jpg",
        },
        {
            name: "Catch me if you can",
            singer: "NEGAV x Quang Hùng MasterD x Nicky x Công Dương",
            path: "/assets/music/cmiyc.mp3",
            image: "/assets/img/cmiyc.jpg",
        },
        {
            name: "Chúng ta không thuộc về nhau",
            singer: "Sơn Tùng MT-P",
            path: "/assets/music/ctktvn.mp3",
            image: "/assets/img/ctktvn.jpg",
        },
        {
            name: "Nắng ấm xa dần",
            singer: "Sơn Tùng MT-P",
            path: "/assets/music/naxd.mp3",
            image: "/assets/img/naxd.jpg",
        },
        {
            name: "Chúng ta của hiện tại",
            singer: "Sơn Tùng MT-P",
            path: "/assets/music/ctcht.mp3",
            image: "/assets/img/ctcht.jpg",
        }
    ],

    setConFig: function(key, value) {
        this.configs[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.configs))
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            
              <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="song-contain">
                    <div class="song-img" style="background-image: url('${song.image}')" alt></div>
                    <div class="song-text">
                        <h5 class="song-name">${song.name}</h5>
                        <p class="song-artist">${song.singer}</p>
                    </div>
                </div>

                <div class="song-contain song-select">
                    <div>
                        <i class="song-favorite-1 btn song-favorite fa-regular fa-heart" aria-hidden="true"></i>
                        <i class="btn song-remove-1 fa-solid fa-xmark" onclick="handleRemove(event)" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this

        // Xử lí CD quay / dừng
        const csThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            interations: Infinity
        })
        csThumbAnimate.pause()

        // Khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
            audio.pause()
            } else {
            audio.play()
            }
        }

        //Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('song-playing')
            csThumbAnimate.play()
        }

        //Khi bài hát bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('song-playing')
            csThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xử lí tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lí random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lí phát lại bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lí next song khi kết thúc bài hát
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.onclick()
                
            }
        }
        
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.song-remove-1')) {
                if(e.target.closest('.song:not(.active)')) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //Xử lí xóa bài hát
            }
        }
    },
    scrollToActiveSong: function() {
        setTineout(() =>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function() {
        songName.textContent = this.currentSong.singer
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex)

            this.currentIndex = newIndex
            this.loadCurrentSong()
    },
    start: function() {
        //Định nghĩa các thuộc tinh cho object
        this.defineProperties()

        //Lắng nghe và xử lí các sự kiện
        this.handleEvents()
        
        
        this.loadCurrentSong ()

        //Render playlist
        this.render()
        }
   }

   function handleFavorite(event) {
    event.stopPropagation()
    const songElement = event.target.closest('.song')
    const dataIndex = songElement.dataset.index;
    const favBtn = $(`.song-favorite-${dataIndex}`)

    if (!app.songs[dataIndex].isFavorite) {
        favBtn.classList.replace("fa-regular", "fa-solid")
        app.songs[dataIndex].isFavorite = true;
    } else {
        favBtn.classList.replace("fa-solid", "fa-regular")
        app.songs[dataIndex].isFavorite = false;
    }
}

function handleRemove(event) {
    event.stopPropagation()
    const songElement = event.target.closest('.song')
    const dataIndex = songElement.dataset.index;
    const removeBtn = $(`.song-remove-${dataIndex}`)

    const removeSong = removeBtn.closest('.song')
    app.songs.splice(removeSong, 1)
    removeSong.style.display = 'none'
}

   app.start()