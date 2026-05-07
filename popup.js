// 确保 DOM 加载完成后再执行
document.addEventListener('DOMContentLoaded', function() {
  const inputEl = document.getElementById('inputText');
  const outputEl = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');

  // --- 转换逻辑 ---
  if (inputEl) {
    inputEl.addEventListener('input', () => {
      const rawText = inputEl.value;
      if (!rawText.trim()) {
        outputEl.value = "";
        return;
      }

      const parts = rawText.split(/([\?？])/);
      const faqList = [];

      for (let i = 1; i < parts.length; i += 2) {
        const questionMark = parts[i];
        const beforeMark = parts[i - 1] || "";
        const afterMark = parts[i + 1] || "";

        // 提取 Title：不再按空格切分，只按换行符或结尾标点切分
        let title = beforeMark.trim();
        // 我们只保留换行符 \n 和常见的中文句尾标点作为“标题开始”的边界
        const titleSegments = title.split(/[\n。！!；;]/); 
        title = titleSegments[titleSegments.length - 1].trim() + questionMark;

        // 提取 Desc：同样移除空格作为切分符
        let desc = afterMark.trim();
        if (i + 2 < parts.length) {
          const nextBeforeMark = parts[i + 1] || "";
          const nextSegments = nextBeforeMark.trim().split(/[\n。！!；;]/);
          const nextTitleCandidate = nextSegments[nextSegments.length - 1];
          desc = nextBeforeMark.trim().substring(0, nextBeforeMark.trim().length - nextTitleCandidate.length).trim();
        }

        if (title) {
          faqList.push({ "title": title, "desc": desc });
        }
      }

      outputEl.value = JSON.stringify({ "faqList": faqList }, null, 2);
    });
  }

  // --- 复制按钮逻辑 ---
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!outputEl.value) {
        alert("没有内容可以复制！");
        return;
      }
      outputEl.select();
      document.execCommand('copy');
      alert("JSON 已成功复制到剪贴板！");
    });
  }
});