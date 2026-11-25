import type { TripPage } from "../types/Trip";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAY_TITLE = /^(\d+)日目$/;

const newPage = (title: string): TripPage => ({
  id: crypto.randomUUID(),
  title,
  memo: "",
  links: [],
});

const dayTitle = (day: number) => `${day}日目`;

const dayNumber = (page: TripPage): number | null => {
  const match = DAY_TITLE.exec(page.title);
  return match ? Number(match[1]) : null;
};

/** 旅行の日数。日付が未入力・不正・逆転している場合は null */
export const countDays = (
  startDate: string,
  endDate: string
): number | null => {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return null;

  const days = Math.round((end - start) / MS_PER_DAY) + 1;

  return days > 0 ? days : null;
};

/** 新しい旅行用のページ（「共通」＋日別ページ） */
export const createPages = (
  startDate: string,
  endDate: string
): TripPage[] => {
  const days = countDays(startDate, endDate) ?? 0;

  return [
    newPage("共通"),
    ...Array.from({ length: days }, (_, i) =>
      newPage(dayTitle(i + 1))
    ),
  ];
};

/**
 * 日付の変更に合わせて日別ページを増減する。
 * 既存の「n日目」ページはそのまま残し、足りない日を追加、範囲外の日を削除する。
 * 日付が不正な場合はページを変更しない。
 */
export const resizePages = (
  pages: TripPage[],
  startDate: string,
  endDate: string
): TripPage[] => {
  const days = countDays(startDate, endDate);

  if (days === null) return pages;

  const otherPages = pages.filter(
    (page) => dayNumber(page) === null
  );

  const dayPages = new Map<number, TripPage>();
  for (const page of pages) {
    const day = dayNumber(page);
    if (day !== null && !dayPages.has(day)) {
      dayPages.set(day, page);
    }
  }

  return [
    ...otherPages,
    ...Array.from(
      { length: days },
      (_, i) =>
        dayPages.get(i + 1) ?? newPage(dayTitle(i + 1))
    ),
  ];
};

/** resizePages で削除される日別ページ */
export const getRemovedPages = (
  pages: TripPage[],
  startDate: string,
  endDate: string
): TripPage[] => {
  const days = countDays(startDate, endDate);

  if (days === null) return [];

  return pages.filter((page) => {
    const day = dayNumber(page);
    return day !== null && day > days;
  });
};

/** メモかリンクが入っているページか */
export const hasPageContent = (page: TripPage) =>
  page.memo.replace(/<[^>]*>/g, "").trim() !== "" ||
  (page.links ?? []).length > 0;
