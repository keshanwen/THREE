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
          uniform float uTime;
          float random(vec2 st){
            return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453);
          }

          float rand(float n){
            return fract(sin(n)*100000.0);
          }

          // 噪声函数
          float noise(vec2 st) {
            // 分解成整数和小数
            vec2 i = floor(st*1.0);
            vec2 f = fract(st*1.0);
            // 算出四个顶点的随机值
            float a = random(i);
            float b = random(i+vec2(1.0,0.0));
            float c = random(i+vec2(0.0,1.0));
            float d = random(i+vec2(1.0,1.0));

            // 使用缓动函数进行平滑插值
            f = f*f*(3.0-2.0*f);

            // float c = mix(a,b,f.x)+(c-a)*f.y*(1.0-f.x) + (d-b)*f.y*f.x;
            // 根据插值结果计算出最终的随机值
            float strength = a*(1.0-f.x)+b*f.x+(c-a)*f.y*(1.0-f.x) + (d-b)*f.y*f.x;
            return strength;
          }


          


          float fbm(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 2.0;

            for(int i=0;i<6;i++){
              value += amplitude*noise(st);
              st *= frequency;
              amplitude *= 0.5;
            }
            return value;
          }


          float fbmAbs(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 2.0;

            for(int i=0;i<6;i++){
              value += amplitude*abs(sin(noise(st)*6.28)) ;
              st *= frequency;
              amplitude *= 0.5;
            }
            return value;
          }

          float fbmAbsN(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 2.0;

            for(int i=0;i<6;i++){
              value += amplitude*abs(sin(noise(st)*6.28)) ;
              st *= frequency;
              amplitude *= 0.5;
            }
            return 1.0-value;
          }

          float fbmMul(vec2 st) {
            float value =  fbm(fbm(fbm(st)+st)+st);
            return value;
          }

          float fbmRotate(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 2.0;

            vec2 shift = vec2(100.0);
            mat2 rot = mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));

            for(int i=0;i<6;i++){
              value += amplitude*noise(st);
              st = rot*st*frequency+shift;
              amplitude *= 0.5;
            }
            return value;


          }

          



          void main(){


            
            // float strength = noise(vPosition.xy*10.0);

            // gl_FragColor = vec4(strength,strength,strength, 1.0);

            // 分形噪声叠加
            // float strength = 0.5*noise(vPosition.xy*2.0)+0.25*noise(vPosition.xy*4.0)+0.125*noise(vPosition.xy*8.0);
            // // fbm = smoothstep(0.0,2.0,fbm);
            // gl_FragColor = vec4(strength,strength,strength, 1.0);

            // 调用封装的分形函数
            // float strength = fbm(vPosition.xy*5.0);
            // gl_FragColor = vec4(strength,strength,strength, 1.0);


            // 引用sin的特性实现取绝对值的效果,谷底效果
            // float strength = fbmAbs(vPosition.xy*5.0);
            // gl_FragColor = vec4(strength,strength,strength, 1.0);


            // 山峰的效果
            // float strength = fbmAbsN(vPosition.xy*5.0);
            // gl_FragColor = vec4(strength,strength,strength, 1.0);

            // 多个分形噪声函数嵌套
            // float strength = fbmMul(vPosition.xy*1.0);
            // gl_FragColor = vec4(strength,strength,strength, 1.0);


            // 旋转的分形噪声
            // float strength = fbmRotate(vPosition.xy*15.0);
            // gl_FragColor = vec4(strength,strength,strength, 1.0);

            

            // 复杂的分形函数
            vec2 st = vPosition.xy*3.0;
            float u_time = uTime;
            vec2 q = vec2(0.0);
            q.x = fbmRotate(st+0.01*u_time);
            q.y = fbmRotate(st+vec2(1.0));

            vec2 r = vec2(0.0);
            r.x = fbmRotate(st+1.0*q+vec2(1.7,9.2)+0.15*u_time);
            r.y = fbmRotate(st+1.0*q+vec2(8.3,2.8)+0.126*u_time);


            float f = fbmRotate(st+r);

            vec3 color = vec3(0.0);

            color = mix(
              vec3(0.101,0.619,0.666),
              vec3(0.666,0.827,0.491),
              clamp(f*f*4.0,0.0,1.0)
            );


            color = mix(
              color,
              vec3(0.0,0.0,0.16),
              clamp(length(q),0.0,1.0)
            );

            color = mix(
              color,
              vec3(0.5,1.0,1.0),
              clamp(length(r.x),0.0,1.0)
            );
  


            gl_FragColor = vec4(color*(f*f*f+0.6*f*f+0.5*f), 1.0);
            

            


            
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

    this.uTime = this.gl.getUniformLocation(this.program, "uTime");
    this.gl.uniform1f(this.uTime, 0.0);
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

    this.gl.uniform1f(this.uTime, performance.now() / 1000);

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
