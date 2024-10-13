const example = document.getElementById("example");
const gl = example.getContext("webgl");
gl.clearColor(0.0, 1.0, 0.0, 0.2);
gl.clear(gl.COLOR_BUFFER_BIT);

const vShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vShader,
  /* glsl */
  ` void main(){
      gl_Position = vec4(.0,.0,.0,1.0);
      gl_PointSize = 40.0;
    }
  `
);
gl.compileShader(vShader);

const fShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fShader,
  ` 
            void main(){
              gl_FragColor = vec4(1.0,.0,.0,1.0);
            }
        `
);

gl.compileShader(fShader);

const program = gl.createProgram();
gl.attachShader(program, vShader);
gl.attachShader(program, fShader);
gl.linkProgram(program);
gl.useProgram(program);

/*

 顶点着色器
    用来描述顶点特性的如 位置， 颜色。逐顶点执行
 片元着色器
    逐片元执行。
    片元可以理解为是像素（图形的单元）

    javascript 读取了着色器的相关信息，然后存在WEBGL 系统中以供调用.

    着色器运行在 webgl 系统中，而不是运行在 javascript 程序中.

    webgl 程序包括 运行在浏览器中的 javascript 和运行在 Webgl系统的着色器程序这两个部分。


    vec4 表是4个浮点数组成的失量
    齐次坐标 （x,y,z,w）等价于三维坐标系（x/w,y/w,z/w）所以如果第四个分量是 1 ，你就可以把它当作三维坐标系使用。
    齐次坐标 ??????????????????????????

    gl.drawArrays(mode,first,count)

    mode 指定绘制的方式，可接收如下常量
        gl.POINTS 
        gl.LINES
        gl.LINES_STIRP
        gl.LINE_LOOP
        gl.TRIANGLES
        gl.TRIANGLE_STIRP
        ......
*/
// 绘制一个点
gl.drawArrays(gl.POINTS, 0, 1);
