### ai-vision-finder-unit-test ###

- [x] 修改 `src/tests/__mocks__/@appium/support.ts`，补充 `imageUtil` mock（含 `requireSharp` 链式 mock）
- [x] 新建 `src/tests/vision-finder.test.ts`，包含以下测试用例：
  - [x] 构造函数：缺少 API_BASE_URL 时抛出错误
  - [x] 构造函数：缺少 API_TOKEN 时抛出错误
  - [x] 构造函数：环境变量齐全时正常初始化
  - [x] findElement：JSON 格式 bbox 正常解析，返回正确的 bbox/center/target
  - [x] findElement：数组格式 bbox 正常解析
  - [x] findElement：normalized 坐标正确转换为绝对像素坐标
  - [x] findElement：absolute 坐标直接使用，不做转换
  - [x] findElement：坐标越界时被 clamp 到图像边界
  - [x] findElement：x1>x2 或 y1>y2 时自动 swap
  - [x] findElement：API 调用失败时抛出包含 HTTP 状态码的错误
  - [x] findElement：模型响应无法解析 bbox 时抛出错误
  - [x] findElement：图片宽度超过 imageMaxWidth 时触发压缩缩放
- [x] 运行测试，确认全部通过


updateAtTime: 2026/3/11 15:17:51

planId: 4e544d18-379d-489e-83fb-8c29b36d7b85