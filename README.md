# 佐伊 · 暮光嬉戏

佐伊（暮光星灵）主题的响应式静态同人网页，模仿 [kuaidianguguji.github.io](https://kuaidianguguji.github.io) 的单页角色站风格。纯 HTML、CSS、JavaScript，无依赖、无构建步骤、不依赖 CDN 或在线字体；**全部视觉由 CSS 渐变与内联 SVG 现场绘制**，不附带任何外部图片。

## 查看页面

直接双击 `index.html` 即可浏览。本地预览：

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

浏览器打开 `http://127.0.0.1:4173/`。

## 发布到 GitHub Pages

1. 将本仓库根目录的 `index.html`、`404.html`、`styles.css`、`script.js`、`.nojekyll` 与整个 `assets` 文件夹上传。
2. 仓库 **Settings → Pages** 选择 **Deploy from a branch**，分支 `main`，目录 `/(root)`。
3. 发布后访问 `https://heqiangdiao-wq.github.io/lol-zoe/`。

## 页面内容与交互

- 三张全幅主题幻境 Hero 每 6 秒自动循环，支持左右按钮、底部圆点和暂停 / 继续；悬浮玻璃导航与主题色按钮。
- 故事 / 能力 / 画廊 / 手记四个入口；五项技能（被动 + Q/W/E/R）切换。
- 八个画廊场景（CSS 渐变卡片，4:3），分类筛选、大图弹窗、左右切换。
- 三篇同人手记，点击卡片阅读。
- 页脚、独立 404 页面、兔子/徽记风格站标（SVG）。
- 手机折叠菜单、响应式栅格。
- 支持键盘操作、弹窗 Esc 关闭、焦点恢复与系统「减少动态效果」设置。
- 顶部星形按钮控制粒子效果。

## 数据来源

- 技能名称与简介依据 [Riot Data Dragon 16.20.1](https://ddragon.leagueoflegends.com/cdn/16.20.1/data/zh_CN/champion/Zoe.json)（简体中文）。
- [佐伊 官方英雄页面](https://www.leagueoflegends.com/zh-tw/champions/)。
- 画廊场景、三篇手记与全部视觉为同人 / CSS 创作，非官方剧情。

《英雄联盟》及相关角色属于 Riot Games。本站为非官方同人主题展示，与 Riot Games 无关联。
