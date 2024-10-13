const example = document.getElementById("example");
const gl = example.getContext("webgl");

/*
      指定清空 canvas 的颜色
      一旦指定了背景颜色之后，背景色就会常驻在WEBGL系统中，在下一次调用 gl.clearColor() 方法之前不会改变。换句话说，如果你将来你还想用
      同一个颜色再清空一次绘图区，没必要在指定一次背景色。
  */
gl.clearColor(1.0, 0.0, 0.0, 0.2);
/*
  清空 canvas（用背景颜色清空  canvas 区域）
  注意函数的参数是 gl.COLOR_BUFFER_BIT, 而不是表示绘图区域的canvas。这是因为WEBGL中 gl.clear 方法实际上继承来自 opengl ,它基于多基本缓冲区模型
  ，清空绘图区域实际上是清空颜色缓冲区（color buffer）,传递参数 gl.COLOR_BUFFER_BIT 就是告诉 webgl 清空颜色缓冲区。除了颜色缓冲区还有其他
  缓冲区，比如深度缓冲区，模板缓冲区。

  gl.clear(arg)

  arg:  gl.COLOR_BUFFER_BIT 指定颜色缓冲区           gl.clearColor(r,g,b,a)   0,0,0,0
  gl.DEPTH_BUFFER_BIT 指定深度缓冲区                 gl.clearDepth(depth)      1   
  gl.STENCIL_BUFFER_BIT  指定模板缓冲区              gl.clearStencill(s)        0             

*/
gl.clear(gl.COLOR_BUFFER_BIT);
