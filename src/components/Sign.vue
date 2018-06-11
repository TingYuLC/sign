<template>
  <div class="sign">
    <div class="draw">
      <canvas id="sign" :width="width" :height="height">当前浏览器不支持canvas</canvas>
      <span v-show="isShow">请在此区域内签名</span>
    </div>
    <div class="option">
      <div class="wrap">
        <button @click="clear">重写</button>
        <button @click="submit">生成图片</button>
      </div>
    </div>
    <div class="picture" v-show="isImg">
      <div class="mask" />
      <img :src="imgUrl" />
      <button @click="confirm">确定</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sign',
  data () {
    return {
      width: 0,
      height: 0,
      // 是否正在绘画
      drawSign: false,
      // 是否展示中间文字
      isShow: true,
      // 是否展示图片
      isImg: false,
      // 图片资源
      imgUrl: '',
      // canvas ID
      sign: '',
      // canvas 2d
      context: ''
    }
  },
  methods: {
    // 重写
    clear () {
      this.isShow = true
      if (this.sign.getContext) {
        this.context.clearRect(0, 0, this.sign.width, this.sign.height)
      }
    },
    // 提交
    submit () {
      if (this.sign.getContext) {
        this.imgUrl = this.sign.toDataURL('image/png')
        this.isImg = true
      }
    },
    // 确定
    confirm () {
      this.isImg = false
    },
    // PC端签名
    PCSign () {
      this.sign.onmousedown = e => {
        this.isShow = false
        e = e || window.event
        this.context.beginPath()
        this.context.moveTo(e.pageX - this.sign.offsetLeft, e.pageY - this.sign.offsetTop - document.body.offsetTop)
        this.context.stroke()
        this.drawSign = true
      }
      this.sign.onmousemove = (e) => {
        if (this.drawSign) {
          e = e || window.event
          this.context.lineTo(e.pageX - this.sign.offsetLeft, e.pageY - this.sign.offsetTop - document.body.offsetTop)
          this.context.stroke()
        }
      }
      this.sign.onmouseout = (e) => {
        if (this.drawSign) {
          this.drawSign = false
          this.context.closePath()
        }
      }
      this.sign.onmouseup = (e) => {
        if (this.drawSign) {
          this.drawSign = false
          this.context.closePath()
        }
      }
    },
    // 移动端签名
    MobileSign () {
      this.sign.addEventListener('touchstart', (e) => {
        e.preventDefault()
        this.isShow = false
        const touch = e.touches[0]
        this.context.beginPath()
        this.context.moveTo(touch.pageX - this.sign.offsetLeft, touch.pageY - this.sign.offsetTop - document.body.offsetTop)
        this.context.lineTo(touch.pageX - this.sign.offsetLeft + 4, touch.pageY - this.sign.offsetTop - document.body.offsetTop)
        this.context.stroke()
        this.drawSign = true
      }, false)
      this.sign.addEventListener('touchmove', (e) => {
        if (this.drawSign) {
          e.preventDefault()
          const touch = e.touches[0]
          this.context.lineTo(touch.pageX - this.sign.offsetLeft, touch.pageY - this.sign.offsetTop - document.body.offsetTop)
          this.context.stroke()
        }
      }, false)
      this.sign.addEventListener('touchend', (e) => {
        if (this.drawSign) {
          e.preventDefault()
          this.drawSign = false
          this.context.closePath()
        }
      }, false)
    }
  },
  mounted () {
    this.sign = document.getElementById('sign')
    this.context = this.sign.getContext('2d')
    this.width = document.documentElement.clientWidth
    this.height = document.documentElement.clientHeight / 5 * 4
    // 监听浏览器窗口变化
    window.addEventListener('resize', e => {
      this.width = document.documentElement.clientWidth
      this.height = document.documentElement.clientHeight / 5 * 4
      this.clear()
    })
    if (this.sign.getContext) {
      this.context.fillStyle = '#000'
      this.context.lineWidth = 2
      this.context.strokeStyle = '#000'
      if (('ontouchend' in document)) {
        // PC端
        this.MobileSign()
      } else {
        // 移动端
        this.PCSign()
      }
    }
  }
}
</script>
<style scoped>
.sign {
  position: fixed;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  top: 0;
  left: 0;
}
.sign .draw {
  width: 100%;
  height: 80%;
  position: relative;
}
.sign .draw span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 18px;
  color: #999999;
  letter-spacing: 0;
  line-height: 25px;
}
.sign .option {
  height: 20%;
  background-color: #F4F4F4;
  box-shadow: 2px 0 4px 0 rgba(0,0,0,0.10);
  position: relative;
}
.option .wrap {
  position: absolute;
  top: 50%;
  width: 300px;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.option .wrap button, .picture button {
  width: 100px;
  height: 44px;
  opacity: 0.3;
  border: 1px solid #063B76;
  border-radius: 2px;
  font-size: 18px;
  color: #063B76;
  letter-spacing: 0;
  line-height: 18px;
  cursor: pointer;
  background: #fff;
  outline: none;
}
.wrap button:first-child {
  float: left;
}
.wrap button:last-child {
  float: right;
}
.sign .picture {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
}
.picture .mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: .3;
}
.picture img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80%;
  z-index: 1200;
  background: #fff;
}
.picture button {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  z-index: 2000;
  font-size: 25px;
  letter-spacing: 10px;
  cursor: pointer;
  border: 1px solid #F3F3F3;
  background: #F3F3F3;
  opacity: 1;
}
</style>
