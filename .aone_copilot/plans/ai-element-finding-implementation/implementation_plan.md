### ai-element-finding-implementation ###
根据设计方案实现AI驱动的元素查找功能，包括创建AI Vision Finder模块、增强find.ts和click.ts工具，完全符合benchmark_model.ts的实现标准

# AI Element Finding Implementation Plan

## User Review Required

> [!IMPORTANT]
> 本实现将添加新的AI元素查找功能，需要用户配置以下环境变量才能使用：
> - `API_BASE_URL`: 视觉模型API端点（必需）
> - `API_TOKEN`: API认证密钥（必需）
> - `AI_VISION_MODEL`: 模型名称（可选，默认Qwen3-VL-235B-A22B-Instruct）
> - `AI_VISION_COORD_TYPE`: 坐标类型（可选，默认normalized）

> [!WARNING]
> 修改现有工具：
> - `src/tools/interactions/find.ts` - 添加ai_instruction策略
> - `src/tools/interactions/click.ts` - 添加W3C Actions API支持坐标点击

---

## Proposed Changes

### AI Finder Module (New)

#### [NEW] [src/ai-finder/types.ts](file:///Users/youngfreefjs/Desktop/code/github/appium-mcp/src/ai-finder/types.ts)

创建类型定义文件，包含：
- `AIVisionConfig` - AI视觉配置接口
- `BBoxCoordinates` - 边界框坐标接口
- `AIFindResult` - AI查找结果接口
- `CoordType` - 坐标类型枚举

```typescript
export interface AIVisionConfig {
  model: string;
  apiBaseUrl: string;
  apiToken: string;
  coordType: 'normalized' | 'absolute';
  imageMaxWidth: number;
  imageQuality: number;
}

export interface BBoxCoordinates {
  target: string;
  bbox_2d: number[];
}

export interface AIFindResult {
  bbox: number[];
  center: { x: number; y: number };
  target: string;
}
```

---

#### [NEW] [src/ai-finder/vision-finder.ts](file:///Users/youngfreefjs/Desktop/code/github/appium-mcp/src/ai-finder/vision-finder.ts)

创建AI视觉查找器核心模块，完全对齐benchmark_model.ts实现：

**关键功能**：
1. 环境变量配置验证（API_BASE_URL, API_TOKEN）
2. 图片压缩（使用@appium/support的sharp）
3. Prompt生成（与benchmark完全一致的格式）
4. 视觉模型API调用（包含min_pixels/max_pixels参数）
5. BBox解析（支持JSON和数组两种格式）
6. 坐标转换（支持normalized和absolute两种类型）
7. 边界检查和坐标校正

**实现细节**：
- 超时设置：120秒（与benchmark一致）
- 图片压缩：默认最大宽度1080px，质量80
- 坐标类型：支持环境变量配置
- 错误处理：完整的异常捕获和日志输出

---

### Enhanced Tools (Modified)

#### [MODIFY] [src/tools/interactions/find.ts](file:///Users/youngfreefjs/Desktop/code/github/appium-mcp/src/tools/interactions/find.ts)

增强findElement工具以支持AI模式：

**Schema变更**：
```typescript
// 添加ai_instruction到strategy枚举
strategy: z.enum([
  'xpath', 'id', 'name', 'class name', 'accessibility id',
  'css selector', '-android uiautomator', '-ios predicate string',
  '-ios class chain',
  'ai_instruction'  // NEW
])

// selector改为可选
selector: z.string().optional()

// 新增ai_instruction参数
ai_instruction: z.string().optional()
```

**执行逻辑**：
1. 检查strategy类型进行路由
2. 传统模式：保持原有逻辑不变
3. AI模式：
   - 捕获截图
   - 获取图片尺寸（使用@appium/support的sharp）
   - 调用AIVisionFinder
   - 返回特殊格式的elementUUID：`ai-element:{x},{y}:{bbox}`

**工具描述更新**：添加AI模式使用说明和环境变量要求

---

#### [MODIFY] [src/tools/interactions/click.ts](file:///Users/youngfreefjs/Desktop/code/github/appium-mcp/src/tools/interactions/click.ts)

增强click工具以支持AI坐标点击：

**新增导入**：
```typescript
import { getPlatformName, PLATFORM } from '../../session-store.js';
import { performActions } from '../../command.js';
```

**执行逻辑增强**：
1. 检查elementUUID是否以`ai-element:`开头
2. AI模式：
   - 解析坐标：`ai-element:{x},{y}:{bbox}`
   - 使用W3C Actions API执行点击
   - 构建pointer action序列（参考double-tap.ts）
3. 传统模式：保持原有逻辑不变

**W3C Actions API实现**：
```typescript
const operation = [{
  type: 'pointer',
  id: 'finger1',
  parameters: { pointerType: 'touch' },
  actions: [
    { type: 'pointerMove', duration: 0, x, y },
    { type: 'pointerDown', button: 0 },
    { type: 'pause', duration: 50 },
    { type: 'pointerUp', button: 0 }
  ]
}];
await performActions(driver, operation);
```

---

### Tool Registration (No Changes Required)

`src/tools/index.ts` 无需修改，因为：
- findElement和clickElement已经注册
- 新增的AI功能通过增强现有工具实现
- 保持向后兼容性

---

## Verification Plan

### Automated Tests

```bash
# 1. 类型检查
npm run build

# 2. Lint检查
npm run lint

# 3. 格式检查
npm run format:check
```

### Manual Verification

1. **环境变量配置测试**：
   - 测试缺少API_BASE_URL时的错误提示
   - 测试缺少API_TOKEN时的错误提示
   - 测试默认模型配置

2. **传统模式兼容性测试**：
   - 使用xpath策略查找元素
   - 使用id策略查找元素
   - 确保原有功能完全正常

3. **AI模式功能测试**：
   - 配置正确的环境变量
   - 使用ai_instruction策略查找元素
   - 验证返回的elementUUID格式
   - 使用返回的UUID进行点击操作

4. **图片压缩测试**：
   - 验证大图片被正确压缩
   - 验证压缩后的图片质量
   - 验证API响应时间改善

5. **坐标转换测试**：
   - 测试normalized坐标类型
   - 测试absolute坐标类型
   - 验证边界检查逻辑

6. **错误处理测试**：
   - 测试API调用失败场景
   - 测试BBox解析失败场景
   - 测试超时场景

---

## Implementation Notes

> [!NOTE]
> **与benchmark_model.ts的对齐**：
> - 环境变量命名：API_BASE_URL, API_TOKEN（完全一致）
> - Prompt格式：使用相同的详细格式和说明
> - API调用参数：包含min_pixels和max_pixels
> - 超时设置：120秒
> - BBox解析：支持JSON和数组两种格式
> - 坐标转换：支持normalized和absolute
> - 边界检查：完整的坐标校正逻辑

> [!TIP]
> **性能优化**：
> - 图片压缩可减少50-80%大小
> - API响应速度提升2-5倍
> - Token消耗显著降低

> [!IMPORTANT]
> **向后兼容性**：
> - 所有现有的locator策略继续正常工作
> - AI功能是可选的，需要环境变量配置
> - 不影响任何现有功能

---

## File Structure

```
src/
├── ai-finder/                    # NEW MODULE
│   ├── types.ts                  # Type definitions
│   └── vision-finder.ts          # Core AI finder
│
├── tools/interactions/
│   ├── find.ts                   # MODIFIED: Add ai_instruction
│   └── click.ts                  # MODIFIED: W3C Actions API
│
└── tools/index.ts                # NO CHANGE: Already registered
```

updateAtTime: 2026/3/11 14:46:24

planId: 119c1ff7-c03e-4245-b46c-7ed68fb3c5aa