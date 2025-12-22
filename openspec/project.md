# Project Context

## Purpose

GitHub Immortality 是一个 GitHub 统计卡片生成器，以中国修仙小说《凡人修仙传》为灵感，将用户的 GitHub 贡献转化为修仙境界的可视化展示。项目目标是：

- 🎨 提供具有中国传统水墨画风格的精美 SVG 卡片
- 📊 全面展示用户的 GitHub 统计数据（commits、PRs、issues、reviews、stars、followers）
- 🏆 通过 13 个修仙境界系统（从练气到道祖）来呈现用户的成就等级
- ⚡ 基于 Vercel Edge Functions 实现高性能的 serverless 服务

## Tech Stack

### 核心技术
- **TypeScript 5.4+**: 主要开发语言，启用严格模式
- **Node.js 18+**: 运行时环境
- **Vercel Serverless Functions**: 部署平台和 Edge Functions
- **@vercel/node 3.1.5**: Vercel 运行时

### 依赖库
- **axios 1.6.8**: HTTP 请求和 GitHub GraphQL API 调用
- **word-wrap 1.2.5**: 文本换行处理

### 开发工具
- **pnpm 8.14.3+**: 包管理器（强制使用）
- **TypeScript 5.4.2**: 类型检查和编译
- **ESLint 8.57.0**: 代码质量检查
- **Prettier 3.2.5**: 代码格式化
- **Husky 9.0.11**: Git hooks 管理
- **lint-staged 15.2.2**: 预提交代码检查

## Project Conventions

### Code Style

#### 命名约定
- **文件名**: 使用 kebab-case（如 `top-languages.ts`, `stats.ts`）
- **类名**: 使用 PascalCase（如 `ImmortalityRender`, `CustomError`）
- **接口名**: 使用 PascalCase，以 `I` 开头（如 `IStats`, `ILanguage`）
- **函数/变量**: 使用 camelCase（如 `fetchStats`, `renderBackground`）
- **常量**: 使用 UPPER_SNAKE_CASE（如 `GRAPHQL_STATS_QUERY`）

#### 格式化规则
- 缩进：2 空格
- 分号：必须使用
- 引号：单引号优先
- 行尾：LF
- 尾随逗号：ES5 标准
- 通过 ESLint + Prettier 自动格式化
- Husky + lint-staged 确保提交前代码格式正确

#### TypeScript 配置
- `strict: true` - 启用所有严格类型检查
- `noImplicitAny: true` - 禁止隐式 any 类型
- `esModuleInterop: true` - 启用 ES 模块互操作
- `forceConsistentCasingInFileNames: true` - 强制文件名大小写一致

### Architecture Patterns

#### 分层架构
项目采用清晰的三层架构：

```
api/              # API 层 - Vercel 函数入口
  └── index.ts    # 主 API 处理器，处理请求和响应

src/
├── fetchers/     # 数据获取层 - 与外部 API 交互
│   ├── request.ts   # HTTP 请求封装
│   └── stats.ts     # GitHub 数据获取逻辑
│
├── render/       # 渲染层 - SVG 生成
│   ├── base.ts           # 渲染基类
│   ├── render.ts         # 渲染入口
│   ├── error.ts          # 错误卡片渲染
│   └── immortality/      # 修仙主题渲染组件
│       ├── index.ts           # 主渲染器类
│       ├── background.ts      # 背景渲染
│       ├── level.ts           # 境界等级渲染
│       ├── name.ts            # 用户名渲染
│       ├── radar.ts           # 雷达图渲染
│       ├── stamp.ts           # 印章渲染
│       └── top-languages.ts   # Top 语言渲染
│
├── graphql/      # GraphQL 查询定义
├── types/        # TypeScript 类型定义
├── common/       # 通用工具和错误处理
└── assets/       # 静态资源（SVG 图标等）
```

#### 设计模式

1. **类继承模式**: `ImmortalityRender` 继承自 `Render` 基类，便于扩展不同主题
2. **组件化**: 每个渲染功能独立为单独的函数或类（如 `renderBackground`, `renderLevel`）
3. **重试机制**: 使用 `retryer` 包装 API 请求，提供容错能力
4. **错误处理**: 自定义 `CustomError` 类，提供结构化错误信息
5. **并发请求**: 使用 `Promise.all` 并发获取用户统计和语言数据

#### 核心流程

```
请求 → API Handler → fetchStats → [statsFetcher, topLanguagesFetcher] 
     → calculateRank → ImmortalityRender → SVG 响应
```

### Testing Strategy

目前项目处于早期阶段，暂无正式测试框架。未来测试策略：

- **单元测试**: 针对 `common/` 工具函数和数据处理逻辑
- **集成测试**: 测试 API 端点和 GitHub API 交互
- **视觉回归测试**: 验证 SVG 渲染输出的一致性
- **性能测试**: 确保 Vercel Functions 在 10 秒超时限制内完成

### Git Workflow

#### 分支策略
- **main**: 生产分支，自动部署到 Vercel
- 功能开发直接在 main 分支或短期功能分支

#### 提交约定
- 使用语义化提交信息（推荐但未强制）
- Husky 预提交 hook 自动运行 lint-staged
- 提交前必须通过 ESLint 检查

#### 部署流程
- 推送到 main 分支自动触发 Vercel 部署
- Vercel 自动构建和部署 Serverless Functions

## Domain Context

### 修仙境界系统

项目核心概念是将 GitHub 贡献映射到 13 个修仙境界：

| 境界 | 中文 | 排名要求 |
|------|------|----------|
| 13 | 道祖 | Top 1% |
| 12 | 大罗金仙 | Top 5% |
| 11 | 太乙真仙 | Top 10% |
| 10 | 金仙 | Top 15% |
| 9 | 真仙 | Top 20% |
| 8 | 大乘 | Top 30% |
| 7 | 合体 | Top 40% |
| 6 | 炼虚 | Top 50% |
| 5 | 化神 | Top 60% |
| 4 | 元婴 | Top 70% |
| 3 | 金丹 | Top 80% |
| 2 | 筑基 | Top 90% |
| 1 | 练气 | 起始境界 |

### 排名算法

境界通过加权公式计算：

```typescript
rank = calculateRank({
  commits: totalCommits,    // 权重: 1x (带反作弊机制)
  prs: totalPRs,            // 权重: 3x
  reviews: totalReviews,    // 权重: 2x
  issues: totalIssues,      // 权重: 2x
  stars: totalStars,        // 权重: 6x (最高)
  followers: totalFollowers // 权重: 4x
});
```

### SVG 渲染

- **尺寸**: 固定 500x220px
- **圆角**: 10px
- **动画**: 使用 CSS `@keyframes` 实现淡入效果
- **字体**: 中文使用 'Microsoft YaHei', 'PingFang SC'；英文使用 'Segoe UI', Ubuntu, Sans-Serif
- **主题**: 当前仅支持水墨画风格的 light 主题

## Important Constraints

### 技术限制

1. **Vercel Functions 限制**:
   - 最大执行时间: 10 秒
   - 内存限制: 128MB
   - 响应大小限制: 适度（SVG 应保持精简）

2. **GitHub API 限制**:
   - 速率限制: 5000 请求/小时（认证）
   - 多页面数据获取: 在公共实例上默认禁用（`FETCH_MULTI_PAGE_STARS !== 'true'`）
   - 需要配置 GitHub Personal Access Token

3. **缓存策略**:
   - SVG 响应缓存: 3 小时（`max-age=10800`）
   - 避免频繁请求 GitHub API

4. **Node.js 版本**:
   - 最低要求: Node.js 18.0.0
   - 必须使用 pnpm 8.14.3+（通过 engines 字段强制）

### 业务约束

1. **单一用户查询**: API 仅支持单个用户名查询，不支持批量请求
2. **仅支持公开数据**: 只能访问用户的公开 GitHub 统计信息
3. **SVG 输出**: 当前仅支持 SVG 格式，不支持 PNG/JPEG

## External Dependencies

### GitHub GraphQL API

- **端点**: `https://api.github.com/graphql`
- **认证**: Bearer Token（Personal Access Token）
- **查询内容**:
  - 用户基本信息（name, login）
  - 贡献统计（commits, PRs, reviews, issues）
  - 仓库数据（stars, repositories）
  - 社交数据（followers）
  - 编程语言使用情况

### Vercel Platform

- **部署**: 自动从 GitHub 部署
- **Serverless Functions**: 处理 API 请求
- **环境变量**:
  - `PAT_1` - GitHub Personal Access Token（主要）
  - `PAT_2` - GitHub Personal Access Token（备用）
  - `FETCH_MULTI_PAGE_STARS` - 是否启用多页面数据获取

### 静态资源

- SVG 图标和装饰元素存储在 `src/assets/immortality/light/`
- 包括：云彩、人物、笔刷、印章、宝剑等水墨画元素
- 13 个境界等级的 SVG 图标（`level/1.svg` - `level/13.svg`）
