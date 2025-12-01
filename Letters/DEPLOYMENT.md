# 网站部署指南

## 部署前准备工作

### 1. 项目检查摘要

- ✅ **构建脚本验证**：项目使用Vite构建工具，构建脚本正常
- ✅ **依赖项检查**：所有依赖项配置正确
- ✅ **构建验证**：项目能够成功构建，无错误
- ✅ **环境变量配置**：需要设置`GEMINI_API_KEY`环境变量

### 2. 环境变量配置

项目依赖Google Gemini API，需要配置以下环境变量：

- `GEMINI_API_KEY`：Google Gemini API密钥

配置方式：
- 在部署平台（如Vercel、Netlify）的环境变量设置中添加
- 或创建`.env`文件（注意：生产环境不建议提交到版本控制）

### 3. 构建验证

项目已通过构建测试，构建命令：

```bash
npm run build
```

构建输出目录：`dist/`

## 推荐部署平台

根据项目特点，推荐以下部署平台：

### 1. Vercel

**优势**：
- 对React和Vite项目支持极佳
- 自动部署和预览
- 简单的环境变量配置
- 免费方案可用

**部署步骤**：
1. 注册/登录Vercel账号
2. 连接GitHub仓库或上传项目
3. 在项目设置中配置环境变量`GEMINI_API_KEY`
4. 点击部署，Vercel会自动识别Vite项目并构建

### 2. Netlify

**优势**：
- 简单直观的部署界面
- 持续集成支持
- 环境变量配置方便
- 免费方案包含CDN

**部署步骤**：
1. 注册/登录Netlify账号
2. 连接GitHub仓库或拖拽dist文件夹
3. 在Build & Deploy设置中：
   - Build Command: `npm run build`
   - Publish directory: `dist`
4. 在环境变量设置中添加`GEMINI_API_KEY`
5. 点击部署

### 3. GitHub Pages

**优势**：
- 与GitHub直接集成
- 免费托管静态网站
- 版本控制与部署结合

**部署步骤**：
1. 确保项目在GitHub仓库中
2. 安装gh-pages包：
   ```bash
   npm install --save-dev gh-pages
   ```
3. 在package.json中添加脚本：
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. 运行部署命令：
   ```bash
   npm run deploy
   ```
5. 注意：使用GitHub Pages无法直接设置环境变量，需要考虑其他方式管理API密钥（如使用代理服务器）

## 部署后验证

部署完成后，建议验证以下内容：

1. 网站是否正常加载
2. 字体功能是否正常工作
3. 背景颜色按钮是否显示正确图标
4. Gemini API功能是否正常（需要API密钥正确配置）

## 注意事项

1. **API密钥安全**：请勿将`GEMINI_API_KEY`提交到版本控制系统
2. **生产环境优化**：确保生产环境中的API调用有适当的错误处理和速率限制
3. **构建缓存**：部署平台通常会缓存依赖项以加速构建
4. **域配置**：如需自定义域名，请在部署平台中配置域名设置

## 故障排除

如果部署后遇到问题：

1. 检查环境变量是否正确设置
2. 查看部署日志中的错误信息
3. 确保构建命令正确执行且生成了dist目录
4. 验证所有外部资源（如Google Fonts）是否可正常访问