const {
	override,
	addPostcssPlugins,
	addWebpackAlias,
} = require("customize-cra");
const pxToViewport = require("postcss-px-to-viewport");
const path = require("path");

// 配置别名
const alias = addWebpackAlias({
	"@": path.resolve(__dirname, "src"),
	// 公共sass路径
	"@scss": path.resolve(__dirname, "src", "assets", "styles"),
});

// 配置 PostCSS 样式转换插件
const postcssPlugins = addPostcssPlugins([
	// 移动端布局 viewport 适配方案
	pxToViewport({
		// 视口宽度：可以设置为设计稿的宽度
		viewportWidth: 375,
		// 白名单：不需对其中的 px 单位转成 vw 的样式类类名
		// selectorBlackList: ['.ignore', '.hairlines']
	}),
]);

// 导出要进行覆盖的 webpack 配置
module.exports = override(alias, postcssPlugins);
