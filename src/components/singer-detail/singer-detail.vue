<template>
	<transition name="slide">
		<music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
		<!-- <div class="singer-detail"></div> -->
	</transition>
</template>
<script>
	import MusicList from 'components/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {getSingerDetail} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'
	export default {
		data() {
			return {
				songs: []
			}
		},
		computed: {
			title() {
				return this.singer.name
			},
			bgImage() {
				return this.singer.avatar
			},
			...mapGetters([
				'singer'
			])
		},
		created() {
			this._getDetail()
		},
		methods: {
			_getDetail() {
				// 歌手详情页刷新 则返回上一页
				if(!this.singer.id){
					this.$router.push('/singer')
					return
				}
				getSingerDetail(this.singer.id).then((res) => {
					if(res.code === ERR_OK){
						this.songs = this._normalizeSongs(res.data.list)
					}
				})
			},
			_normalizeSongs(list){
				let ret = []
				list.forEach((item) => {
					let {musicData} = item
					if(musicData.songid && musicData.albumid){
						ret.push(createSong(musicData))
					}
				})
				return ret
			}
		},
		components: {
			MusicList
		}
	}	
</script>
<style lang="stylus" scoped>
	@import '~common/stylus/variable'
	.singer-detail
		position: fixed
		z-index: 100
		left: 0
		right: 0
		top: 0
		bottom: 0
		background-color: $color-background
	.slide-enter-active, .slide-leave-active
		transition: all 0.3s

	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)
</style>