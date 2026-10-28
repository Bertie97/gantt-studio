# 验证记录

验证日期：2026-10-28。环境：Linux x64、Node.js 24.19.0。

- `npm test`：4 项模型测试通过。
- `npm run test:ui`：5 项 Chromium 交互测试通过，覆盖新建、编辑、持久化、导入导出、左右边框、Ctrl / Command 自由调整、自动分行、类别边沿、跨类别移动、取消拖动、缩放和平移。
- `npm run build`：生产构建通过。
- `npm audit`：0 个已知漏洞。
- `npm run dist -- --linux --publish never`：AppImage / deb 均成功生成。
- 打包后的 Electron 45.1.0 Linux 程序：用独立临时数据目录启动，成功加载 5 个示例任务，打开编辑器并保存任务名称。自动化启动使用 `--no-sandbox` 适配测试环境；产品配置未禁用 sandbox。
- 手动查看浏览器截图，已修复隐藏导入控件显示、单行类别说明溢出问题。

Windows / macOS 的原生安装包构建尚未在本机执行；由 `.github/workflows/build.yml` 在对应原生 runner 上生成。安装包尚未配置商业签名及公证。

## 1.1.0 增量验证

- `npm test`：10 项通过。新增依赖图循环保护、前后联动、多前置与菱形依赖、空行删除、旧版项目兼容、SVG 输出校验。
- `npm run test:ui`：9 项通过。新增 Shift 连接与取消、关键点创建/编辑/删除/拖动及 Ctrl 自由调整、图中直接删除空行、下拉菜单 JSON/PNG/SVG 导出。
- SVG 经 XML 解析验证；PNG 经文件头及像素尺寸验证，并实际查看导出图片排版。
- `npm run dist -- --linux --publish never`：1.1.0 AppImage / deb 成功生成。
- 打包后的桌面程序：关键点拖动正常；Electron 原生 `will-download` 事件验证 PNG 保存完成（261803 字节），浏览器测试之外的桌面下载流程已确认。
- `npm install --package-lock-only` 的依赖审计：0 个已知漏洞。
- UI 截图见 `docs/screenshot.png`、`docs/export-menu.png`；图片导出样例见 `docs/export-example.png`。
