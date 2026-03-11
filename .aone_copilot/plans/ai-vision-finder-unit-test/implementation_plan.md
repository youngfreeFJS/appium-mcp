### ai-vision-finder-unit-test ###
为 AIVisionFinder 类生成完整的 Jest 单元测试，mock axios 和 @appium/support/imageUtil，使用 benchmark 的 image.png 作为 mock 截图输入。

# AIVisionFinder 单元测试

为 `src/ai-finder/vision-finder.ts` 中的 `AIVisionFinder` 类编写完整的 Jest 单元测试，覆盖核心方法的正常路径、异常路径和边界情况。

## User Review Required

> [!IMPORTANT]
> `image.png` 是 benchmark 的真实截图，文件较大。测试中将通过 `fs.readFileSync` 读取并转为 base64，作为 mock 截图输入，不会真正发起 API 请求。

## Proposed Changes

### AI Finder 测试

#### [NEW] [vision-finder.test.ts](file:///Users/youngfreefjs/Desktop/code/github/appium-mcp/src/tests/vision-finder.test.ts)

测试覆盖以下场景：

**构造函数**
- 缺少 `API_BASE_URL` 时抛出错误
- 缺少 `API_TOKEN` 时抛出错误
- 环境变量齐全时正常初始化

**`findElement` 方法（核心流程）**
- 正常流程：mock axios 返回 JSON 格式 bbox，验证返回的 `bbox`、`center`、`target`
- 正常流程：mock axios 返回数组格式 bbox `[x1, y1, x2, y2]`
- normalized 坐标转换：验证 0-1000 归一化坐标正确转换为绝对像素坐标
- absolute 坐标直接使用：验证绝对坐标不做转换
- 坐标越界裁剪：验证坐标被 clamp 到图像边界内
- 坐标顺序修正：x1>x2 或 y1>y2 时自动 swap
- API 调用失败时抛出包含 HTTP 状态码的错误
- 模型响应无法解析 bbox 时抛出错误

**图片压缩（`compressImage` 私有方法，通过 `findElement` 间接测试）**
- 图片宽度超过 `imageMaxWidth` 时触发缩放（通过环境变量 `AI_VISION_IMAGE_MAX_WIDTH` 控制）
- 压缩失败时降级使用原始图片

**Mock 策略**
- `axios.post`：使用 `jest.mock('axios')` mock，返回预设的模型响应
- `@appium/support` 的 `imageUtil.requireSharp()`：在 `__mocks__/@appium/support.ts` 中补充 `imageUtil` mock，返回一个链式 sharp mock 对象（`.resize().jpeg().toBuffer()` 返回 mock buffer）
- benchmark 截图：通过 `fs.readFileSync` 读取 `src/tests/benchmark_model/image.png` 并转为 base64，作为 `screenshotBase64` 参数传入

---

### Mock 补充

#### [MODIFY] [support.ts](file:///Users/youngfreefjs/Desktop/code/github/appium-mcp/src/tests/__mocks__/@appium/support.ts)

在现有 `logger` mock 基础上，补充 `imageUtil` 的 mock：

```diff
+ export const imageUtil = {
+   requireSharp: jest.fn(() => {
+     const sharpInstance = {
+       resize: jest.fn().mockReturnThis(),
+       jpeg: jest.fn().mockReturnThis(),
+       toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-compressed-image')),
+     };
+     return jest.fn(() => sharpInstance);
+   }),
+ };
```

## Verification Plan

### Automated Tests

```bash
NODE_OPTIONS=--experimental-vm-modules npx jest src/tests/vision-finder.test.ts --verbose
```

### Manual Verification

- 确认所有测试用例通过，无 TypeScript 编译错误
- 确认 mock 不会真正发起网络请求


updateAtTime: 2026/3/11 15:17:51

planId: 4e544d18-379d-489e-83fb-8c29b36d7b85