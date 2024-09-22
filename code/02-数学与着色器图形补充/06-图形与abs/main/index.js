class Shape {
  constructor(selector) {
    // 获取canvas元素
    this.canvas = document.querySelector(selector);
    //   设置canvas的宽高
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // 获取webgl上下文
    this.gl = this.canvas.getContext("webgl");

    //   初始化着色器
    this.initShader();
    // 链接程序
    this.initProgram();
    // 绘制
    this.initDraw();
  }
  initShader() {
    // 创建顶点着色器
    this.vShader = this.gl.createShader(this.gl.VERTEX_SHADER);

    // 顶点着色器源码
    this.gl.shaderSource(
      this.vShader,
      `
      attribute vec4 v_position;
      varying vec4 vPosition;
      void main(){
        gl_Position = v_position;
        vPosition = v_position+0.5;
        gl_PointSize = 20.0;
      }
    `
    );
    //   编译顶点着色器
    this.gl.compileShader(this.vShader);

    // 创建片元着色器
    this.fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    // 片元着色器源码
    this.gl.shaderSource(
      this.fShader,
      /*glsl*/ ` 
          precision mediump float;
          uniform vec4 uColor;
          varying vec4 vPosition;
          void main(){
            
            // float strength = vPosition.x * vPosition.x * vPosition.x;
            // vec2 pos = (vPosition.xy-0.5)*2.0;
            // float strength =  pow(2.0,pow(pos.x,2.0)+pow(pos.y,2.0)-1.0);
            float strength = abs( log(vPosition.x*5.0+0.1));
            gl_FragColor = vec4(strength, strength, strength, 1.0);
          }
      `
    );

    // 编译片元着色器
    this.gl.compileShader(this.fShader);
  }
  initProgram() {
    // 创建着色器程序链接顶点着色器和片元着色器
    this.program = this.gl.createProgram();
    //   添加顶点着色器
    this.gl.attachShader(this.program, this.vShader);
    //   添加片元着色器
    this.gl.attachShader(this.program, this.fShader);
    //   链接着色器程序
    this.gl.linkProgram(this.program);
    //   使用着色器程序
    this.gl.useProgram(this.program);
  }
  initDraw() {
    // 创建顶点数据
    this.position = this.gl.getAttribLocation(this.program, "v_position");
    //   创建缓冲区
    this.pBuffer = this.gl.createBuffer();
    //   绑定缓冲区
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pBuffer);

    // 将顶点数据提供给到atttribute变量
    this.gl.vertexAttribPointer(
      //告诉attribute变量从哪里获取数据
      this.position,
      2, // 每次迭代提供2个单位的数据
      this.gl.FLOAT, // 每个单位的数据类型是32位浮点型
      false, // 不需要归一化数据
      0, // 0 步长
      0 // 从缓冲区的哪个位置开始读取数据
    );

    //   开启attribute变量
    this.gl.enableVertexAttribArray(this.position);

    this.vertices = [];

    //   获取片元着色器中的uColor变量
    this.uColor = this.gl.getUniformLocation(this.program, "uColor");
    //   设置片元着色器中的uColor变量
    this.gl.uniform4f(this.uColor, 1.0, 1.0, 0.0, 1.0);
  }
  drawPoint(x, y) {
    this.vertices = [x, y];
    //   设置顶点数据
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      this.gl.STATIC_DRAW // 静态绘制
    );
    //   设置片元着色器中的uColor变量
    this.gl.uniform4f(this.uColor, 1.0, 0.0, 0.0, 1.0);
    //   绘制
    this.gl.drawArrays(this.gl.POINTS, 0, 1);
  }
  moveTo(x, y) {
    this.vertices.push(x, y);
    //   设置顶点数据
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      this.gl.STATIC_DRAW // 静态绘制
    );

    this.gl.drawArrays(this.gl.POINTS, 0, this.vertices.length / 2);
  }
  lineTo(x, y) {
    this.vertices.push(x, y);
    //   设置顶点数据
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      this.gl.STATIC_DRAW // 静态绘制
    );
    this.gl.drawArrays(this.gl.POINTS, 0, this.vertices.length / 2);
    this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.vertices.length / 2);
  }
  rect(x, y, width, height, color) {
    this.vertices = [
      x,
      y,
      x + width,
      y,
      x + width,
      y + height,
      x,
      y + height,
      x,
      y,
    ];
    // 设置uniform变量
    //   设置片元着色器中的uColor变量
    console.log(color);
    this.gl.uniform4f(this.uColor, ...color);

    //   设置顶点数据
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      this.gl.STATIC_DRAW // 静态绘制
    );

    // 创建索引数据
    this.indexBuffer = this.gl.createBuffer();
    // 绑定索引缓冲区
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // 2个三角形绘制矩形
    // // 设置索引数据
    // this.gl.bufferData(
    //   this.gl.ELEMENT_ARRAY_BUFFER,
    //   new Uint8Array([0, 1, 3, 3, 1, 2]),
    //   this.gl.STATIC_DRAW
    // );
    // // 绘制
    // this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_BYTE, 0);

    // 1个三角带绘制矩形
    // 设置索引数据
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint8Array([0, 1, 3, 2]),
      this.gl.STATIC_DRAW
    );
    // 绘制
    this.gl.drawElements(this.gl.TRIANGLE_STRIP, 4, this.gl.UNSIGNED_BYTE, 0);
  }
}
