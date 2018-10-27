(function (window, Vue, undefined) {
	// Your starting point. Enjoy the ride!

	new Vue({
		el: '#app',
		data: {
			list: JSON.parse(window.localStorage.getItem('list')) || [],
			newtodo: '',
			abc: false,
			beforeUpdate: {},
			activeBtn: 1,
			showArr: []
		},

		//监听
		watch: {
			list: {
				handler (newArr) {
					window.localStorage.setItem('list', JSON.stringify(newArr))

					this.hashchange()
				},
				deep: true
			},
		},
		//计算属性  (0 item left)
		computed: {
			activeNum () {
				return this.list.filter(item => !item.isFinish).length
			},
			toggleAll: {
				get() {//被计算项
					//判断每一个是不是 true
					return this.list.every(item => item.isFinish)
				},
				set(val) {//计算项
					// console.log(val)
					// this.abc = val;
					this.list.forEach(item => item.isFinish = val)
				}
			}
		},
		directives: {
			focus: {
				inserted (el) {
					el.focus();
				}
			}
		},
		//生命周期
		created () {

			// this.showAll()
			this.hashchange()
			window.onhashchange = () => {
				this.hashchange()
			}
		},
		methods: {
			//添加
			addtodo() {
				// console.log('触发');
				if (!this.newtodo.trim()) {
					return;
				}
				this.list.push({
					content: this.newtodo,
					isFinish: false,
					id: this.list.length ? this.list.sort((a,b) => a.id - b.id)[this.list.length - 1].id + 1 : 1
				})
				this.newtodo = ''
			},
			//删除单个
			deltodo(index) {
				this.list.splice(index,1)
			},
			//删除所有
			// 逻辑： 帅选出为false 的,  相当于把为true的给删了
			delAll() {
				this.list = this.list.filter(item => !item.isFinish)
			},
			showEdit(index) {
				console.log(index)
				// console.log(this.$refs)
				this.$refs.show.forEach(item => {
					item.classList.remove('editing')
				})
				this.$refs.show[index].classList.add('editing')
				this.beforeUpdate = JSON.parse(JSON.stringify(this.list[index]))
			},
			//真正的编辑事件
			updatetodo (index) {
				if(!this.list[index].content.trim()) return this.list.splice(index,1)
				if(this.list[index].content !== this.beforeUpdate.content)  return this.list[index].isFinish = false
				this.$refs.show[index].classList.remove('editing')
			},
			// 还原内容
			backtodo(index) {
				// console.log(123)
				this.list[index].content = this.beforeUpdate.content
				this.$refs.show[index].classList.remove('editing')
			},
			//hashchange事件
			hashchange () {
				// console.log('hass')
				switch (window.location.hash) {
					case '':
					case'#/':
						this.showAll()
						this.activeBtn = 1
						break
					case '#/active':
						this.activeAll(false)
						this.activeBtn = 2
						break
					case '#/completed':
						this.activeAll(true)
						this.activeBtn = 3
						break
				}
			},
			//创建一个显示的数组
			showAll() {
				//map  映射
				this.showArr = this.list.map(() => true)
				// console.log(this.showArr)
			},
			//修改显示数组使用
			activeAll(boo) {
				this.showArr =  this.list.map((item) => item.isFinish===boo)
				// console.log(this.showArr)
				// 判断是不是有 true
				if(boo && this.list.every(item => item.isFinish === !boo)) return window.location.hash = '#/'
				if(!boo && this.list.every(item => item.isFinish === !boo)) return window.location.hash = '#/'

			}
		}
	})

})(window, Vue);
//map
