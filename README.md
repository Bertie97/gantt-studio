# Gantt Studio

一个支持 Windows、macOS 和 Linux 的本地甘特图规划软件。使用 Electron + Vite + 原生 JavaScript，无账号、无服务端，项目数据保存在当前设备。

![Gantt Studio 界面](docs/screenshot.png)

## 开发与运行

需要 Node.js **22.12 或更高版本**（推荐 Node.js 24 LTS）。

```bash
npm ci
npm run dev      # 浏览器开发预览
npm run desktop  # 构建并打开桌面应用
```

## 使用方式

- 时间轴默认按周显示，每周从周一开始，表头显示年份、月份和日期。拖动空白区域或横向滚动可平移。
- 点击 `＋` / `−`，或按住 Ctrl / Command 滚轮缩放；“今天”返回当前日期。
- 双击类别的空白时间网格新建任务；双击圆角任务块编辑名称、内容及起止时间。
- 拖动任务本体移动任务，可移动到其他类别；拖动左右边框修改开始或结束时间。
- 默认吸附到最近的周一。按住 **Ctrl（Windows / Linux）或 Command（macOS）** 可自由调整至分钟精度。
- 重叠采用半开区间 `[开始, 结束)` 判断；结束时间与下一任务开始时间相同不算重叠。
- 放下任务时若目标行已有重叠任务，会在目标行下方插入新行；拖到类别顶部或底部的提示带并释放，会插入新行。
- 点击“新建类别”或左下“添加类别”设置类别名称和说明；类别右侧 `···` 可修改、删除。
- 变更自动保存到本地。JSON 导出可用于备份和跨设备迁移；导入会在确认后替换当前项目。
- 拖动时按 Escape 或失去窗口焦点可取消当前拖动。

日历按无时区的墙上时间处理（内部用 UTC 编码），避免不同系统时区、夏令时影响每周宽度。编辑器显示的时间与时间轴一致，不转换为实际 UTC 时刻。删除任务不会自动压缩空行，保留手工安排的行位置。

## 测试

```bash
npm test
npx playwright install chromium
npm run test:ui
npm run build
```

模型测试覆盖周吸附、自由调整精度、相邻任务、重叠插行、类别边沿插行与导入校验。浏览器测试覆盖任务创建编辑、保存恢复、导入导出、拖动、缩放和平移。

## 跨平台打包

```bash
npm run pack    # 生成当前平台未安装的应用目录
npm run dist    # 生成当前平台安装包
```

| 构建系统 | 输出 |
| --- | --- |
| Windows | NSIS `.exe` 安装器 |
| macOS | `.dmg` / `.zip` |
| Linux | `.AppImage` / `.deb` |

产物位于 `release/`。GitHub Actions 的 `Desktop packages` 工作流支持手动运行，或推送 `v*` 标签触发，在三个原生系统分别构建并上传产物。当前配置生成未签名安装包；正式对外发行时应接入 Windows 代码签名和 Apple 签名、公证凭据。macOS 架构遵循构建机器，可在相应架构原生 runner 上构建。

## 项目结构

- `src/main.js`：UI、任务编辑、鼠标交互、本地存储与导入导出。
- `src/model.js`：时间计算、重叠检测、自动插行及项目校验。
- `src/style.css`：响应式桌面界面。
- `electron/main.cjs`：隔离运行的桌面窗口。
- `.github/workflows/build.yml`：跨平台安装包构建。
- `tests/`：模型与浏览器交互测试。

本仓库仅创建在本地；尚未关联远程仓库。

## 本次验证

Linux 安装包与桌面启动已验证，详见 [验证记录](docs/validation.md)。安装包主页暂指向作者 GitHub 主页，发布独立远程仓库后可更新 `package.json` 的 `homepage`。
