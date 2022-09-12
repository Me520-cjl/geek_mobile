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

// 移动端布局 - viewport 适配方案
const viewport = pxToViewport({
	// 设计稿的宽度
	viewportWidth: 375,
	// 不需要将 px 转 vw 的白名单
	// 说明：该数组中的类名中的 px 不会被转化为 vw。 这些类名可以为任意名称。
	// selectorBlackList: ['.ignore', '.hairlines']
});

module.exports = override(addPostcssPlugins([viewport]), alias);
