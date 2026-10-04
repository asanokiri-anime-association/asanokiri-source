# 装饰素材与许可

## 学院风景

路径：public/art/mist-academy.png，1902 × 827 PNG。

用途：门户首页的装饰性异世界学院风景。它不是社团历史资料、真实建筑照片或成员作品，因此不进入 CMS 历史素材库。网页通过 CSS 叠加深浅主题色，不需要分别维护两张图片。

使用内置 imagegen 工具生成。生成提示词如下：

```text
Use case: illustration-story
Asset type: a wide panoramic background illustration for an anime association website, designed as the opening spread of an exquisite Japanese fantasy travel journal.
Primary request: a mist-covered magical academy and its quiet surrounding medieval / early-modern town, with slate roofs, a distant spired observatory, stone footbridge, pine woods and a river valley. Tiny warm lights in the observatory suggest scholarly magic. No people in the foreground.
Style/medium: refined Japanese animation background painting, delicate hand-drawn architectural lines, layered watercolor / gouache, subtle textured paper, atmospheric perspective, expressive but restrained. High artistic detail and carefully controlled color, not 3D game rendering, not glossy AI fantasy poster.
Composition/framing: very wide landscape about 2.3:1. This will sit behind actual HTML text on the left: keep the left third airy and very pale mist with minimal detail, gradually building architectural detail on the right half. Show a low bridge leading the eye toward the magical academy on a hillside at the upper right. Irregular pale parchment edges blend into an off-white web page. The middle and bottom remain soft with room for a thin ornamental line.
Lighting/mood: quiet dawn after rain, pale gold through blue-green mist, invitation to an adventure, mysterious but welcoming.
Color palette: warm ivory paper, muted jade and blue-green, deep pine, weathered bronze and tiny amber windows.
Constraints: image only, no typography, no letters, no logos, no watermark, no interface mockup, no card containers, no UI icons, no characters from existing franchises. Avoid saturated purple, neon effects, heavy lens flare, big glowing circles, highly contrasted foreground clutter. This is an original decorative setting, not a historical photograph.
```

## 字体与图标

- Noto Serif SC Variable：由 @fontsource-variable/noto-serif-sc 分发，SIL Open Font License 1.1，许可副本为 public/licenses/noto-serif-sc.txt。
- Cormorant Garamond：由 @fontsource/cormorant-garamond 分发，SIL Open Font License 1.1，许可副本为 public/licenses/cormorant-garamond.txt。
- Lucide：由 @lucide/vue 分发，许可副本为 public/licenses/lucide.txt。
- 魔法纹章：src/components/MagicSeal.vue 中的项目内 SVG 线稿。

依赖版本以 package.json 和锁文件为准。真实社团插画、照片和二维码另见 content-sources.md。
