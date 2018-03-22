import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'


function findIndex(list, song){
	return list.findIndex((item) => {
		return item.id === song.id
	})
}

export const selectPlay = function({commit, state}, {list, index}){
	commit(types.SET_SEQUENCE_LIST, list)
	if(state.mode === playMode.random){
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST, randomList)
		index = findIndex(randomList, list[index])
	} else {
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit}, {list}){
	commit(types.SET_PLAY_MODE, playMode.random)
	commit(types.SET_SEQUENCE_LIST, list)
	let randomList = shuffle(list)
	commit(types.SET_PLAYLIST, randomList)
	commit(types.SET_CURRENT_INDEX, 0)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({commit, state}, song){
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	let currentSong = playlist[currentIndex]
	// 插入的歌曲是否在当前列表中
	let findPlayingIndex = findIndex(playlist, song)
	currentIndex++
	// 插入
	playlist.splice(currentIndex, 0, song)
	// 若列表中存在了 则删除
	if(findPlayingIndex > -1){
		if(currentIndex > findPlayingIndex){
			playlist.splice(findPlayingIndex, 1)
			currentIndex--
		} else {
			playlist.splice(findPlayingIndex + 1, 1)
		}
	}
	// 当前播放的歌曲在顺序列表中的位置
	let curSeqIndex = findIndex(sequenceList, currentSong) + 1
	// 待插的歌曲在顺序列表中的位置 -1或者其它
	let findSeqIndex = findIndex(sequenceList, song)
	sequenceList.splice(curSeqIndex, 0, song)
	// 存在即删除
	if(findSeqIndex > -1){
		if(curSeqIndex > findSeqIndex) {
			sequenceList.splice(findSeqIndex, 1)
		} else {
			sequenceList.splice(findSeqIndex + 1, 1)
		}
	}

	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query){
	commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, query){
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
	commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function({commit, state}, song){
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	let pIndex = findIndex(playlist, song)
	playlist.splice(pIndex, 1)
	let sIndex = findIndex(sequenceList, song)
	sequenceList.splice(sIndex, 1)
	if (currentIndex > pIndex || currentIndex === playlist.length) {
		currentIndex--
	}

	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)

	if (!playlist.length) {
		commit(types.SET_PLAYING_STATE, false)
	} else {
		commit(types.SET_PLAYING_STATE, true)
	}
}

export const deleteSongList = function({commit}){
	commit(types.SET_CURRENT_INDEX, -1)
	commit(types.SET_PLAYLIST, [])
	commit(types.SET_SEQUENCE_LIST, [])
	commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({commit}, song){
	commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function({commit}, song){
	commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({commit}, song){
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}