export interface AfendaFumadocsRegionalCopy {
  readonly displayName: string;
  readonly searchTrigger: string;
  readonly searchDialog: string;
  readonly inlineToc: string;
  readonly pageActions: {
    readonly copyMarkdown: string;
    readonly open: string;
    readonly openInGitHub: string;
    readonly viewAsMarkdown: string;
    readonly openInScira: string;
    readonly openInChatGPT: string;
    readonly openInClaude: string;
    readonly openInCursor: string;
    readonly readPromptTemplate: string;
  };
}

/** Regional UI copy for locales without an official `@fumadocs/language` pack. */
export const afendaFumadocsRegionalCopy = {
  vi: {
    displayName: "Tiếng Việt",
    searchTrigger: "Tìm kiếm tài liệu",
    searchDialog: "Tìm kiếm tài liệu",
    inlineToc: "Trên trang này",
    pageActions: {
      copyMarkdown: "Sao chép Markdown",
      open: "Mở",
      openInGitHub: "Mở trên GitHub",
      viewAsMarkdown: "Xem dưới dạng Markdown",
      openInScira: "Mở trong Scira AI",
      openInChatGPT: "Mở trong ChatGPT",
      openInClaude: "Mở trong Claude",
      openInCursor: "Mở trong Cursor",
      readPromptTemplate:
        "Đọc {url}, tôi muốn đặt câu hỏi về nội dung này.",
    },
  },
  ms: {
    displayName: "Bahasa Melayu",
    searchTrigger: "Cari dokumentasi",
    searchDialog: "Cari dokumentasi",
    inlineToc: "Di halaman ini",
    pageActions: {
      copyMarkdown: "Salin Markdown",
      open: "Buka",
      openInGitHub: "Buka di GitHub",
      viewAsMarkdown: "Lihat sebagai Markdown",
      openInScira: "Buka dalam Scira AI",
      openInChatGPT: "Buka dalam ChatGPT",
      openInClaude: "Buka dalam Claude",
      openInCursor: "Buka dalam Cursor",
      readPromptTemplate: "Baca {url}, saya ingin bertanya tentangnya.",
    },
  },
  id: {
    displayName: "Bahasa Indonesia",
    searchTrigger: "Cari dokumentasi",
    searchDialog: "Cari dokumentasi",
    inlineToc: "Di halaman ini",
    pageActions: {
      copyMarkdown: "Salin Markdown",
      open: "Buka",
      openInGitHub: "Buka di GitHub",
      viewAsMarkdown: "Lihat sebagai Markdown",
      openInScira: "Buka di Scira AI",
      openInChatGPT: "Buka di ChatGPT",
      openInClaude: "Buka di Claude",
      openInCursor: "Buka di Cursor",
      readPromptTemplate: "Baca {url}, saya ingin bertanya tentangnya.",
    },
  },
  th: {
    displayName: "ไทย",
    searchTrigger: "ค้นหาเอกสาร",
    searchDialog: "ค้นหาเอกสาร",
    inlineToc: "ในหน้านี้",
    pageActions: {
      copyMarkdown: "คัดลอก Markdown",
      open: "เปิด",
      openInGitHub: "เปิดใน GitHub",
      viewAsMarkdown: "ดูเป็น Markdown",
      openInScira: "เปิดใน Scira AI",
      openInChatGPT: "เปิดใน ChatGPT",
      openInClaude: "เปิดใน Claude",
      openInCursor: "เปิดใน Cursor",
      readPromptTemplate:
        "อ่าน {url} ฉันต้องการถามคำถามเกี่ยวกับเนื้อหานี้",
    },
  },
  fil: {
    displayName: "Filipino",
    searchTrigger: "Maghanap ng dokumentasyon",
    searchDialog: "Maghanap ng dokumentasyon",
    inlineToc: "Sa pahinang ito",
    pageActions: {
      copyMarkdown: "Kopyahin ang Markdown",
      open: "Buksan",
      openInGitHub: "Buksan sa GitHub",
      viewAsMarkdown: "Tingnan bilang Markdown",
      openInScira: "Buksan sa Scira AI",
      openInChatGPT: "Buksan sa ChatGPT",
      openInClaude: "Buksan sa Claude",
      openInCursor: "Buksan sa Cursor",
      readPromptTemplate:
        "Basahin ang {url}, gusto kong magtanong tungkol dito.",
    },
  },
} as const satisfies Record<string, AfendaFumadocsRegionalCopy>;
