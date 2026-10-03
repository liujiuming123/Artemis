# Opposing 视频更新

本更新基于 Artemis 仓库 main 分支 a7050f9，保留当时的作者、标题和绿色标语修改。

## 直接插入（推荐）

1. 解压 artemis-opposing-update.zip。
2. 将 index.html、style.css、opposing.js 放到仓库根目录：覆盖前两个文件，新增 opposing.js。
3. 将 assets 文件夹合并到仓库原有的 assets 文件夹；保留已有的 teaser.png 和 pipeline.png。
4. 提交这些文件。GitHub Pages 部署完成后刷新网页。

文件结构：

```
index.html
style.css
opposing.js
assets/
  videos/
    opposing/
      agent1-gt.mp4
      agent1-ma-wm.mp4
      ...
      agent2-oasis.mp4
      （每个视频还有对应的 jpg 封面）
```

不要只上传 ZIP 本身；需要上传解压后的文件，并保持目录结构。
如果使用 GitHub 网页上传，先在仓库首页选择 Add file → Upload files，拖入 index.html、style.css、opposing.js 和整个 assets 文件夹，再 Commit changes。

## 视频排列

列顺序：GT / Artemis (Ours) / Solaris public / Solaris finetuned / OASIS。
上排 Agent 1，下排 Agent 2。第二列文件名中的 ma-wm 对应 Artemis。
共十个独立视频，416×256，10.125 秒，8 fps。已去掉原片的白色标题条，网页重新显示方法标签。
Play all / Pause all、Restart 和共同进度条控制十个视频。

## 如果网页在下载之后又有修改

不要覆盖自己的新修改。改用以下方式合并：

1. 上传 opposing.js 和 assets/videos/opposing/。
2. 从更新包 index.html 中复制整个 <section id="two-single" ...> 到对应位置，替换原来的同名 section。
3. 在原页面的 </head> 前加入：

```html
<script defer src="opposing.js?v=1"></script>
```

4. 从更新包 style.css 中复制从 .opposing-board{ 开始到文件末尾的样式，追加到原 style.css 末尾。
5. 将原来的样式链接版本改成 style.css?v=opposing-1，让浏览器加载更新后的样式。

仅下载裁剪视频可以使用 opposing-cropped-videos.zip；其中也保留 assets/videos/opposing/ 目录结构。
