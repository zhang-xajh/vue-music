<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<div class="dots">
			<span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></span>
		</div>
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	import {addClass} from 'common/js/dom'
	export default {
		data() {
			return {
				dots: [],
				currentPageIndex: 0
			}
		},
		props: {
			loop: {
				// 是否无缝滚动
				type: Boolean,
				default: true
			},
			autoPlay: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 4000
			}
		},
		mounted() {
			setTimeout(() => {
				this._setSliderWidth();
				this._initDots();// 这句要写到下一句前面，否则多两个点。因为BScroll会复制两个dom用以无缝滚动
				this._initSlider();

				if(this.autoPlay){
					this._play();
				}
			}, 20)
			window.addEventListener('resize', () => {
				if(!this.slider){
					return;
				}
				this._setSliderWidth(true);
				this.slider.refresh();
			})
		},
		methods: {
			_setSliderWidth(isResize) {
				this.children = this.$refs.sliderGroup.children;
				let width = 0;
				let sliderWidth = this.$refs.slider.clientWidth;
				for(let i = 0; i < this.children.length; i++){
					let child = this.children[i];
					addClass(child, 'slider-item');
					child.style.width = sliderWidth + 'px';
					width += sliderWidth;
				}
				if(this.loop && !isResize){
					width += 2 * sliderWidth;
				}
				this.$refs.sliderGroup.style.width = width + 'px';
			},
			_initSlider() {
				this.slider = new BScroll(this.$refs.slider, {
					scrollX: true,
					scrollY: false,
					momentum: false,// 惯性
					snap: true,// 该属性是给 slider 组件使用的，普通的列表滚动不需要配置
					snapLoop: this.loop,
					snapThreshold: 0.3,// 阈值，大于这个阈值可以滑动的下一页
					snapSpeed: 400// 轮播图切换的动画时间
				})
				this.slider.on('scrollEnd', () => {
					let pageIndex = this.slider.getCurrentPage().pageX;
					if(this.loop){
						pageIndex -= 1;
					}
					this.currentPageIndex = pageIndex;
					if(this.autoPlay){
						clearTimeout(this.timer);
						this._play();
					}
				})
			},
			_initDots() {
				this.dots = new Array(this.children.length);
			},
			_play() {
				let pageIndex = this.currentPageIndex + 1;
				if(this.loop){
					pageIndex += 1;
				}
				this.timer = setTimeout(() => {
					this.slider.goToPage(pageIndex, 0, 400);// 第二个参数代表y方向的
				}, this.interval);
			}
		},
		destoryed() {
			clearTimeout(this.timer);
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable'
	.slider
		min-height: 1px
		.slider-group
			position: relative
			overflow: hidden
			white-space: nowrap
			.slider-item
				float: left
				box-sizing: border-box
				overflow: hidden
				text-align: center
				a
					display: block
					width: 100%
					overflow: hidden
					text-decoration: none
				img
					display: block
					width: 100%
		.dots
			position: absolute
			right: 0
			left: 0
			bottom: 12px
			text-align: center
			font-size: 0
			.dot
				display: inline-block
				margin: 0 4px
				width: 8px
				height: 8px
				border-radius: 50%
				background: $color-text-l
				&.active
					width: 20px
					border-radius: 5px
					background: $color-text-ll
</style>