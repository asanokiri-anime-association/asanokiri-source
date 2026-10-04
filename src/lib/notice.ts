// 纯函数：方便测试公告的定时边界，不依赖浏览器或构建时间。
import type { Notice } from "../content/schema.ts";

export function isNoticeActive(notice: Notice, now = Date.now()): boolean {
    if (!notice.enabled) return false;
    const start = Date.parse(notice.starts_at);
    const end = Date.parse(notice.ends_at);
    return Number.isFinite(start) && Number.isFinite(end) && now >= start && now < end;
}

export function noticeStorageKey(notice: Notice): string {
    // 调整活动时间或内容后应重新提示；普通刷新不会反复弹出同一公告。
    return `asanokiri-notice:${notice.id}:${notice.starts_at}:${notice.ends_at}:${notice.title}:${notice.text}:${notice.location}:${notice.event_time}`;
}
