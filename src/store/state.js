import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
	singer: {},
	playing: false,
	fullScreen: false,
	playlist: [],// 当前播放列表
	sequenceList: [],// 顺序的列表
	mode: playMode.sequence,
	currentIndex: -1,
	disc: {},
	topList: {},
	searchHistory: loadSearch(),
	playHistory: loadPlay(),
	favoriteList: loadFavorite()
}

export default state