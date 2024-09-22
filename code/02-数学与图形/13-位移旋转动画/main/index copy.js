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
      attribute vec4 a_color;
      varying vec4 v_color;
      uniform mat2 u_matrix;
      uniform mat2 u_viewMatrix;
      uniform vec2 u_translation;
      void main(){
        vec2 pos = (u_matrix * v_position.xy) + u_translation;
        pos = u_viewMatrix  * pos;
        // pos = u_viewMatrix * pos;
        gl_Position = vec4(pos, 0, 1);
        gl_PointSize = 20.0;
        v_color = a_color;
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
      ` 
          precision mediump float;
          uniform vec4 uColor;
          varying vec4 v_color;
          void main(){
            gl_FragColor = v_color;
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
    // this.uColor = this.gl.getUniformLocation(this.program, "uColor");
    //   设置片元着色器中的uColor变量
    // this.gl.uniform4f(this.uColor, 1.0, 1.0, 0.0, 1.0);
    // u_matrix传值
    // this.u_matrix = this.gl.getUniformLocation(this.program, "u_matrix");
    //   设置u_matrix变量
    // 放大2倍的矩阵
    // this.gl.uniformMatrix2fv(this.u_matrix, false, [2, 0, 0, 2]);

    // u_viewMatrix传值
    this.u_viewMatrix = this.gl.getUniformLocation(
      this.program,
      "u_viewMatrix"
    );
    let width = window.innerWidth / 2;
    let height = window.innerHeight / 2;
    //   设置u_viewMatrix变量
    this.gl.uniformMatrix2fv(this.u_viewMatrix, false, [
      1 / width,
      0,
      0,
      1 / height,
    ]);

    // 设置顶点的颜色
    this.aColor = this.gl.getAttribLocation(this.program, "a_color");
    this.cBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
    this.gl.vertexAttribPointer(this.aColor, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.aColor);
    // 设置颜色数据
    this.colors = [
      0,
      0,
      0.0,
      1.0, // 黑色
      1.0,
      0,
      0,
      1.0, // 红色
      1.0,
      1.0,
      0,
      1.0, // 黄色
      0,
      1.0,
      0,
      1.0, // 绿色
    ];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.colors),
      this.gl.STATIC_DRAW
    );
  }
  drawPoint(x, y) {
    // 修改点的颜色
    this.colors = [
      1,
      0,
      1.0,
      1.0, // 黑色
    ];
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.colors),
      this.gl.STATIC_DRAW
    );

    this.vertices = [x, y];
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pBuffer);
    //   设置顶点数据
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      this.gl.STATIC_DRAW // 静态绘制
    );
    //   设置片元着色器中的uColor变量
    // this.gl.uniform4f(this.uColor, 1.0, 0.0, 0.0, 1.0);
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
  rect(x, y, width, height, tX1 = 0, tY1 = 0, rotate = 0, color) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cBuffer);
    // 设置颜色数据
    this.colors = [
      0,
      0,
      0.0,
      1.0, // 黑色
      1.0,
      0,
      0,
      1.0, // 红色
      1.0,
      1.0,
      0,
      1.0, // 黄色
      0,
      1.0,
      0,
      1.0, // 绿色
    ];

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.colors),
      this.gl.STATIC_DRAW
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pBuffer);
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
    // console.log(color);
    // this.gl.uniform4f(this.uColor, ...color);

    // u_translation传值
    this.u_translation = this.gl.getUniformLocation(
      this.program,
      "u_translation"
    );
    //   设置u_translation变量
    this.gl.uniform2f(this.u_translation, tX1, tY1);

    // u_matrix传值
    this.u_matrix = this.gl.getUniformLocation(this.program, "u_matrix");
    // 旋转45度的矩阵
    let mat = [
      Math.cos(rotate),
      Math.sin(rotate),
      -Math.sin(rotate),
      Math.cos(rotate),
    ];
    this.gl.uniformMatrix2fv(this.u_matrix, false, mat);
    console.log(mat);

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
