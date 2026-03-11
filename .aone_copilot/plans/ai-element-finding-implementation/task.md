### ai-element-finding-implementation ###
# AI Element Finding Implementation Tasks

## Phase 1: Create AI Finder Module

### Create Type Definitions
- [ ] 创建 `src/ai-finder/types.ts`
  - [ ] 定义 `AIVisionConfig` 接口
  - [ ] 定义 `BBoxCoordinates` 接口
  - [ ] 定义 `AIFindResult` 接口
  - [ ] 导出所有类型

### Create Vision Finder Core
- [ ] 创建 `src/ai-finder/vision-finder.ts`
  - [ ] 实现 `AIVisionFinder` 类
  - [ ] 实现环境变量配置和验证
  - [ ] 实现 `compressImage` 方法（使用@appium/support的sharp）
  - [ ] 实现 `buildPrompt` 方法（与benchmark格式完全一致）
  - [ ] 实现 `callVisionAPI` 方法（包含min_pixels/max_pixels参数）
  - [ ] 实现 `parseBBox` 方法（支持JSON和数组格式）
  - [ ] 实现 `convertCoordinates` 方法（支持normalized/absolute）
  - [ ] 实现 `findElement` 主方法
  - [ ] 添加完整的错误处理和日志

## Phase 2: Enhance Find Tool

### Modify find.ts Schema
- [ ] 修改 `src/tools/interactions/find.ts`
  - [ ] 在strategy枚举中添加 `'ai_instruction'`
  - [ ] 将selector参数改为optional
  - [ ] 添加ai_instruction参数（optional）
  - [ ] 更新工具描述，添加AI模式说明

### Implement AI Mode Logic
- [ ] 在find.ts的execute函数中实现AI路由
  - [ ] 添加AIVisionFinder导入
  - [ ] 添加imageUtil导入（@appium/support）
  - [ ] 实现strategy检查和路由逻辑
  - [ ] 实现截图捕获
  - [ ] 实现图片尺寸获取
  - [ ] 调用AIVisionFinder.findElement
  - [ ] 生成特殊格式的elementUUID
  - [ ] 返回结果

## Phase 3: Enhance Click Tool

### Modify click.ts Imports
- [ ] 修改 `src/tools/interactions/click.ts`
  - [ ] 添加getPlatformName和PLATFORM导入
  - [ ] 添加performActions导入

### Implement Coordinate Click
- [ ] 在click.ts的execute函数中实现坐标点击
  - [ ] 添加elementUUID前缀检查
  - [ ] 实现坐标解析逻辑
  - [ ] 实现W3C Actions API点击序列
  - [ ] 调用performActions执行点击
  - [ ] 保持传统模式不变

## Phase 4: Testing & Verification

### Build & Lint
- [ ] 运行 `npm run build` 确保编译通过
- [ ] 运行 `npm run lint` 确保代码规范
- [ ] 运行 `npm run format:check` 确保格式正确

### Manual Testing
- [ ] 测试环境变量验证
  - [ ] 测试缺少API_BASE_URL的错误
  - [ ] 测试缺少API_TOKEN的错误
- [ ] 测试传统模式兼容性
  - [ ] 测试xpath策略
  - [ ] 测试id策略
  - [ ] 测试其他传统策略
- [ ] 测试AI模式（需要配置环境变量）
  - [ ] 测试ai_instruction策略
  - [ ] 验证elementUUID格式
  - [ ] 测试坐标点击
- [ ] 测试错误处理
  - [ ] 测试API调用失败
  - [ ] 测试BBox解析失败

updateAtTime: 2026/3/11 14:46:24

planId: 119c1ff7-c03e-4245-b46c-7ed68fb3c5aa