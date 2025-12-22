# Change: Add Web Homepage

## Why

当前项目仅提供 API 端点生成 SVG 统计卡片，用户需要通过 GitHub README 或其他文档了解如何使用。添加一个美观的 web 端主页可以：

- 提升用户体验：提供直观的界面让用户快速了解项目和使用方法
- 增加可发现性：用户可以直接在浏览器中访问和体验功能
- 提供交互式预览：允许用户输入 GitHub 用户名实时预览自己的统计卡片
- 漂亮的外观吸引用户
- SEO 能力，能够被更多的搜索引擎抓取

## What Changes

- **ADDED**: 创建新的 web 主页路由（`/`）
- **ADDED**: 实现响应式 HTML 页面，包含：
  - 交互式卡片预览功能（输入用户名实时生成），再次之上的附加功能：
    - 支持复制 markdown、img链接等格式的文本
  - 链接到 GitHub 仓库
  - 需要支持多语言切换：支持中英双语，根据用户系统语言设置默认的语言
  - 漂亮、动态的界面元素，吸引用户
- **MODIFIED**: 更新 `vercel.json` 的 redirects 配置，将根路径指向新的主页而非直接重定向到 GitHub
- **ADDED**: 静态资源服务（HTML、CSS、JavaScript）

## Impact

- **Affected specs**:
  - `web-homepage` (新增能力)
- **Affected code**:
  - `vercel.json` - 更新路由配置
  - 新增 `public/` 或 `pages/` 目录存放主页文件
  - 可能需要新增前端资源（HTML/CSS/JS）

