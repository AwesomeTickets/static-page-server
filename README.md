# StaticPageServer
2016～2017学年下半学期系统分析与设计课程大作业的电影购票系统的前端代码。   

该项目包使用gulp进行自动化构建。   

## 启动方式
在执行下面命令之前，先确保电脑上已装好较新版本的node.js和npm   

> 在StaticPageServer文件夹根目录下执行以下命令：   
> npm install    
> npm install gulp -g   
> gulp clean     
> gulp (开发时执行此命令)      
> gulp build (运行时，即只输出site文件夹时执行此命令)           

> 在浏览器中打开 http://localhost:8080/     
> 我设置了自动刷新功能，更改代码保存之后页面就会自动刷新了，方便开发。若出现未自动刷新的情况，可手动刷新。若是向项目中添加了新文件或对文件重命名等非更改代码操作，需要重新执行 gulp clean 和 gulp 指令。   

> 构建 docker 镜像：   
> docker build -t proxy-server .

## 目录结构
 -  layouts/：各页面内容部分，放置各.jade文件   
 -  scripts/：放置各页面对应的.js文件   
 -  static/：放置各静态文件，如图片、字体、前端类库等   
 -  styles/：放置各页面对应的.css文件   
 -  gulpfile.js：gulp的配置文件   
 -  index.jade：系统首页   
 -  layout.jade：系统的整体结构布局文件   
 -  package.json：项目包各依赖等信息   
 -  style.scss：全局样式文件，放置一些常用的全局样式等   

## 使用技术   
没有使用前端大型框架，主要使用原生js等进行编写。   

#### Bootstrap   
项目中使用了Bootstrap，更易实现响应式等。   
[教程：http://v3.bootcss.com/](http://v3.bootcss.com/)   

#### jQuery   
如果基础够好，尽量写原生js，性能好一些。但我在项目中也添加进了jQuery类库，想要用也可以用。   
[教程：http://jquery.com/](http://jquery.com/)   

#### jade   
项目中使用了模板语言jade（现在也叫pug），内容不多，学起来比较方便，写起来也比html更简洁。   
[教程：http://learnjade.com/](http://learnjade.com/)   

#### sass   
sass是css的预处理语言，有时间也可以学一下，内容不多。但不学也是可以的，每个页面都是直接写css的。只有在根目录下有一个.scss文件，用于写一些常用的全局样式等。   
[教程：http://sass.bootcss.com/docs/sass-reference/](http://sass.bootcss.com/docs/sass-reference/)   

## 注意事项   
因为项目不算太大，因此也不需要太详细的编码规范，下面是一些值得注意的点。   

#### 文件及其他命名   
当文件名或id名或变量名等各种名字中有多个单词时，采用下划线命名法，如next_page.js等。   

#### Javascript   
如果使用过ES6，尽量用ES6来写。ES6编程风格参照：[http://es6.ruanyifeng.com/#docs/style](http://es6.ruanyifeng.com/#docs/style)   
若ES6不太熟，就写ES5也是可以的。   

#### html(jade)、css   
这个就不做详细要求了，按照以前学的做吧，尽量写更加友好，性能更好的代码。   

#### 缩进
所有的.jade、.js、.css、.scss文件的缩进均采用两个空格！（sublime可以设置的，自己设一下，后面直接按Tab键就是两个空格的缩进了）

#### 注释
养成写注释的习惯，无论是哪个文件，让代码可阅读性更强。

#### 兼容性   
兼容性的话，pml也没给详细要求，我们就自己决定吧。   
需要兼容：IE9及以上，Chrome，Firefox，Safari以及ios和android端上的主流浏览器的较新版本。   
（其实只要不用太新的或太奇怪的特性，以上浏览器基本都能全部兼容的）   

#### 关于响应式   
因为使用bootstrap很容易实现响应式，所以我们做页面时要考虑到在PC、平板电脑、手机等设备上都要良好的呈现信息。(现阶段暂时不用做，但以后有时间可能会做，所以现在做的时候要考虑代码的可扩展性。)     


## License
See the [LICENSE](./LICENSE) file for license rights and limitations.
