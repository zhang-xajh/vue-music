<template>
	<div class="singer" ref="singer">
		<list-view @select="selectSinger" :data="singers" ref="list"></list-view>
		<router-view></router-view>
	</div>
</template>

<script>
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import Singer from 'common/js/singer'
	import ListView from 'base/listview/listview'
	import {mapMutations} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'

	const HOT_NAME = '热门'
	const HOH_SINGER_LEN = 10
	export default {
		mixins: [playlistMixin],
		data() {
			return {
				singers: []
			}
		},
		created() {
			this._getSingerList()
		},
		components: {
			ListView
		},
		methods: {
			handlePlaylist(playlist) {
				// 底部有player时重新让Scroll计算大小
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.singer.style.bottom = bottom
				this.$refs.list.refresh()
			},
			selectSinger(singer) {
				this.$router.push({
					path: `/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			_getSingerList() {
				getSingerList().then( (res) => {
					if(res.code === ERR_OK){
						this.singers = this._normalizeSinger(res.data.list)
						/*
							[
								0: {
									title: '热门',
									items: [...] 每一项
								},
								1: {
									title: 'A',
									items: [...]
								},
								2: {
									title: 'B',
									items: [...]
								}...
							]

						*/
					}
				})
			},
			_normalizeSinger(list) {
				// 将获取的数据进行加工 变成hot和按字母排序的列表
				let map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				}
				list.forEach((item, index) => {
					// 取list中前十条数据做热门数据
					if(index < HOH_SINGER_LEN){
						map.hot.items.push(new Singer({
							id: item.Fsinger_mid,
							name: item.Fsinger_name
						}))
					}
					const key = item.Findex
					if(!map[key]){
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push(new Singer({
						id: item.Fsinger_mid,
						name: item.Fsinger_name
					}))
				})
				// 处理map 得到有序列表
				let hot = []
				let ret = []
				for(let key in map){
					let val = map[key]
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val)
					} else if(val.title === HOT_NAME){
						hot.push(val)
					}
				}
				ret.sort((a, b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				return hot.concat(ret)
			},
			...mapMutations({
				setSinger: 'SET_SINGER'
			})
		}
	}
</script>

<style scoped lang="stylus">
	.singer
		position: fixed
		top: 88px
		bottom: 0
		width: 100%
</style>